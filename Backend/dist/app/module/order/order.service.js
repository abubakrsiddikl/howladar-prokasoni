"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const order_model_1 = require("./order.model");
const order_interface_1 = require("./order.interface");
const book_model_1 = require("../book/book.model");
const AppError_1 = __importDefault(require("../../errorHelper/AppError"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const user_interface_1 = require("../user/user.interface");
const generateOrderId_1 = require("../../utils/generateOrderId");
const user_model_1 = require("../user/user.model");
const sendEmail_1 = require("../../utils/sendEmail");
const createOrder = (payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const session = yield book_model_1.Book.startSession();
    try {
        session.startTransaction();
        if (decodedToken.role !== user_interface_1.Role.CUSTOMER) {
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "Only customers can place orders!");
        }
        let totalAmount = 0;
        // Validate each book & calculate total
        for (const item of payload.items) {
            const book = yield book_model_1.Book.findById(item.book).session(session);
            if (!book) {
                throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, `Book not found: ${item.book}`);
            }
            // Stock check
            if (book.stock < item.quantity) {
                throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `Not enough stock for book: ${book.title}`);
            }
            // Add to total
            totalAmount += book.price * item.quantity;
        }
        const initialOrderStatusLog = {
            status: order_interface_1.OrderStatus.Processing,
            location: "N/A",
            note: "অর্ডারটি গ্রহণ করা হয়েছে। কনফার্মেশনের জন্য অপেক্ষমান।",
            timestamp: new Date(),
        };
        // delivery charge include of totalAmount
        const deliveryCharge = (_a = payload.deliveryCharge) !== null && _a !== void 0 ? _a : 120;
        const subTotal = totalAmount + deliveryCharge;
        // Prepare order data
        const orderData = Object.assign(Object.assign({}, payload), { user: decodedToken.userId, totalAmount: subTotal, orderStatusLog: [initialOrderStatusLog], orderId: yield (0, generateOrderId_1.generateOrderId)() });
        // Create order within transaction
        const [order] = yield order_model_1.Order.create([orderData], { session });
        // Update stock after order creation
        for (const item of payload.items) {
            yield book_model_1.Book.findByIdAndUpdate(item.book, { $inc: { stock: -item.quantity } }, { session });
        }
        yield session.commitTransaction();
        const user = yield user_model_1.User.findById(decodedToken.userId, "-password").session(session);
        if (!user) {
            throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
        }
        const adminsAndStoreManagers = yield user_model_1.User.find({
            role: { $in: [user_interface_1.Role.ADMIN, user_interface_1.Role.STORE_MANAGER] },
        });
        const adminsAndStoreManagersEmails = adminsAndStoreManagers.map((admin) => admin.email);
        // Notify admins and store managers about the new order
        yield (0, sendEmail_1.sendEmail)({
            to: adminsAndStoreManagersEmails.join(", "),
            subject: "New Order Created",
            templateName: "adminOrderEmail",
            templateData: {
                orderId: order.orderId,
                customerName: user.name,
                total: order.totalAmount,
                phone: payload.shippingInfo.phone || user.phone,
                paymentMethod: order.paymentMethod,
                shippingAddress: payload.shippingInfo.address,
                city: payload.shippingInfo.city,
                district: payload.shippingInfo.district,
                division: payload.shippingInfo.division,
            },
        });
        // Notify the customer about their order
        yield (0, sendEmail_1.sendEmail)({
            to: user.email,
            subject: "Order Confirmation",
            templateName: "customerOrderEmail",
            templateData: {
                orderId: order.orderId,
                customerName: user.name,
                total: order.totalAmount,
                phone: payload.shippingInfo.phone || user.phone,
                paymentMethod: order.paymentMethod,
                shippingAddress: payload.shippingInfo.address,
                city: payload.shippingInfo.city,
                district: payload.shippingInfo.district,
                division: payload.shippingInfo.division,
            },
        });
        return order;
    }
    catch (error) {
        if (session.inTransaction()) {
            yield session.abortTransaction();
        }
        // await session.abortTransaction();
        throw new AppError_1.default(http_status_codes_1.default.INTERNAL_SERVER_ERROR, error.message);
    }
    finally {
        session.endSession();
    }
});
// get order by customer id
const getMyOrders = (decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield order_model_1.Order.find({ user: decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.userId }).populate("items.book", "title coverImage");
    return orders;
});
// get all order
const getAllOrders = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield order_model_1.Order.find().populate("user").populate("items.book");
});
const getTraceOrder = (orderId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield order_model_1.Order.findOne({ orderId }).select("orderStatusLog createdAt -_id");
});
const getSingleOrder = (orderId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield order_model_1.Order.findOne({ orderId })
        .populate("user")
        .populate("items.book");
});
// Update order status
const updateOrderStatus = (orderId, newStatus) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield order_model_1.Order.findById(orderId);
    if (!order) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Order not found");
    }
    if (order.currentStatus === newStatus) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `Order status already ${newStatus} `);
    }
    let note = "";
    if (newStatus === order_interface_1.OrderStatus.Approved) {
        note = "অর্ডারটি প্রস্তুত করা হচ্ছে";
    }
    else if (newStatus === order_interface_1.OrderStatus.Shipped) {
        note = "অর্ডারটি কুরিয়ারের কাছে দেয়ার জন্য প্রস্তুত হয়েছে";
    }
    else if (newStatus === order_interface_1.OrderStatus.Delivered) {
        note = "অর্ডারটি ডেলিভারি দেয়া হয়েছে";
    }
    else if (newStatus === order_interface_1.OrderStatus.Cancelled) {
        note = "অর্ডারটি Cancelled করা হয়েছে ";
    }
    order.currentStatus = newStatus;
    order.orderStatusLog.push({
        status: newStatus,
        note: note,
        timestamp: new Date(),
    });
    yield order.save();
    return order;
});
// Update payment status
const updatePaymentStatus = (orderId, paymentStatus) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedOrder = yield order_model_1.Order.findByIdAndUpdate(orderId, { paymentStatus: paymentStatus }, { new: true, runValidators: true });
    return updatedOrder;
});
// delete orders
const deleteOrder = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield order_model_1.Order.findByIdAndDelete(id);
});
exports.OrderService = {
    createOrder,
    getMyOrders,
    getTraceOrder,
    getAllOrders,
    getSingleOrder,
    updateOrderStatus,
    updatePaymentStatus,
    deleteOrder,
};
