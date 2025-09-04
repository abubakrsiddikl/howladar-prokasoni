"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const mongoose_1 = require("mongoose");
const order_interface_1 = require("./order.interface");
const orderItemSchema = new mongoose_1.Schema({
    book: { type: mongoose_1.Schema.Types.ObjectId, ref: "Book", required: true },
    quantity: { type: Number, required: true, min: 1 },
}, { _id: false });
const shippingInfoSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    division: { type: String, required: true },
    district: { type: String, required: true },
    city: { type: String, required: true },
}, { _id: false });
const orderSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    items: { type: [orderItemSchema], required: true },
    shippingInfo: { type: shippingInfoSchema, required: true },
    paymentMethod: {
        type: String,
        enum: Object.values(order_interface_1.PaymentMethod),
        required: true,
        default: order_interface_1.PaymentMethod.COD,
    },
    paymentStatus: {
        type: String,
        enum: Object.values(order_interface_1.PaymentStatus),
        default: order_interface_1.PaymentStatus.Pending,
    },
    totalAmount: { type: Number, required: true, min: 0 },
    orderStatus: {
        type: String,
        enum: Object.values(order_interface_1.OrderStatus),
        default: order_interface_1.OrderStatus.Processing,
    },
    orderId: { type: String, required: true, unique: true },
}, { timestamps: true });
exports.Order = (0, mongoose_1.model)("Order", orderSchema);
