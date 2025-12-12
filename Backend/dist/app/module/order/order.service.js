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
const order_constant_1 = require("./order.constant");
const QueryBuilder_1 = require("../../utils/QueryBuilder");
const sslCommerz_service_1 = require("../sslCommerz/sslCommerz.service");
const sendOrderEmail_1 = require("../../utils/sendOrderEmail");
const generateTransactionId_1 = require("../../utils/generateTransactionId");
const createOrder = (payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
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
        const deliveryCharge = payload.shippingInfo.district === "ঢাকা" ? 60 : 120;
        const subTotal = totalAmount + deliveryCharge;
        // Prepare order data
        const orderData = Object.assign(Object.assign({}, payload), { user: decodedToken.userId, totalAmount: subTotal, orderStatusLog: [initialOrderStatusLog], orderId: yield (0, generateOrderId_1.generateOrderId)(), deliveryCharge: deliveryCharge });
        // * SSLCommerz payment initiate
        if (orderData.paymentMethod === "SSLCommerz") {
            // generate tranId
            const transactionId = (0, generateTransactionId_1.generateSecureTransactionId)(20);
            // 1. ssl payment data
            const sslPayload = {
                orderId: orderData.orderId,
                amount: orderData.totalAmount,
                transactionId: transactionId,
                name: payload.shippingInfo.name,
                email: payload.shippingInfo.email,
                phoneNumber: payload.shippingInfo.phone,
                address: payload.shippingInfo.address,
            };
            // 2. SSL initiate
            const sslResponse = yield sslCommerz_service_1.SSLService.sslPaymentInit(sslPayload);
            //  check ssl res
            if (sslResponse.status === "SUCCESS") {
                orderData.transactionId = sslPayload.transactionId;
                // 4. crete order
                const [order] = yield order_model_1.Order.create([orderData], { session });
                // update stock
                for (const item of payload.items) {
                    yield book_model_1.Book.findByIdAndUpdate(item.book, { $inc: { stock: -item.quantity } }, { session });
                }
                yield session.commitTransaction();
                return {
                    order,
                    paymentUrl: sslResponse.GatewayPageURL,
                };
            }
            else {
                throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Failed to initiate SSLCommerz payment.");
            }
        }
        //* Create order within transaction and cod
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
        yield (0, sendOrderEmail_1.sendOrderEmails)({
            order: order,
            user: user,
            shippingInfo: order.shippingInfo,
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
    const orders = yield order_model_1.Order.find({ user: decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.userId })
        .sort("-createdAt")
        .populate("items.book", "title coverImage");
    return orders;
});
// get all order
const getAllOrders = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryBuilder = new QueryBuilder_1.QueryBuilder(order_model_1.Order.find(), query);
    yield queryBuilder.filter();
    queryBuilder.search(order_constant_1.orderSearchableFields).sort().paginate();
    const [data, meta] = yield Promise.all([
        queryBuilder.build().populate("user", "-password").populate("items.book"),
        queryBuilder.getMeta(),
    ]);
    return { data, meta };
});
const getTraceOrder = (orderId) => __awaiter(void 0, void 0, void 0, function* () {
    const orderInfo = yield order_model_1.Order.findOne({ orderId }).select("orderStatusLog createdAt -_id");
    if (!orderInfo) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "এই অর্ডার আইডি তে কোনো অর্ডার পাওয়া যায় নি দয়া সঠিক অর্ডার আইডি দিন ");
    }
    return orderInfo;
});
const getSingleOrder = (orderId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield order_model_1.Order.findOne({ orderId })
        .populate("user")
        .populate("items.book");
});
// Update order status
// Allowed status transitions
const allowedStatusFlow = {
    Processing: [order_interface_1.OrderStatus.Approved, order_interface_1.OrderStatus.Cancelled],
    Approved: [order_interface_1.OrderStatus.Shipped, order_interface_1.OrderStatus.Cancelled],
    Shipped: [order_interface_1.OrderStatus.Delivered],
    Delivered: [order_interface_1.OrderStatus.Returned],
    Cancelled: [],
    Failed: [],
    Returned: [],
};
// Status এর note
const statusNotes = {
    Processing: "অর্ডারটি গ্রহণ করা হয়েছে। কনফার্মেশনের জন্য অপেক্ষমান।",
    Approved: "অর্ডারটি প্রস্তুত করা হচ্ছে",
    Shipped: "অর্ডারটি কুরিয়ারের কাছে দেয়া হয়েছে",
    Delivered: "অর্ডারটি ডেলিভারি দেয়া হয়েছে",
    Cancelled: "অর্ডারটি বাতিল করা হয়েছে",
    Failed: "",
    Returned: "অর্ডারটি কাস্টমার দ্বারা ফেরত দেয়া হয়েছে",
};
// Update order status function
const updateOrderStatus = (orderId, newStatus) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield order_model_1.Order.findById(orderId);
    if (!order) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "অর্ডারটি পাওয়া যায়নি");
    }
    if (order.currentStatus === newStatus) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `অর্ডারের স্ট্যাটাস ইতিমধ্যেই ${newStatus}`);
    }
    // Check duplicate in log
    const isDuplicate = order.orderStatusLog.some((item) => item.status === newStatus);
    if (isDuplicate) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `অর্ডারের স্ট্যাটাস ইতিমধ্যেই ${newStatus}`);
    }
    // Check allowed status flow
    const allowedNextStatus = allowedStatusFlow[order.currentStatus];
    if (!allowedNextStatus.includes(newStatus)) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `অর্ডারের স্ট্যাটাস ${order.currentStatus} থেকে ${newStatus} সম্ভব নয়`);
    }
    // Update status & add note
    order.currentStatus = newStatus;
    if (newStatus === order_interface_1.OrderStatus.Delivered) {
        order.paymentStatus = order_interface_1.PaymentStatus.PAID;
    }
    // update order status is Cancelled to update  payment status by Cancelled
    if (newStatus === order_interface_1.OrderStatus.Cancelled ||
        newStatus === order_interface_1.OrderStatus.Returned) {
        order.paymentStatus = order_interface_1.PaymentStatus.CANCELLED;
    }
    order.orderStatusLog.push({
        status: newStatus,
        note: statusNotes[newStatus],
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
