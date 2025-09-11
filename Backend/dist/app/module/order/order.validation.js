"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePaymentStatusZodSchema = exports.updateOrderStatusZodSchema = exports.createOrderSchema = exports.shippingInfoSchema = exports.orderItemSchema = void 0;
const zod_1 = require("zod");
const order_interface_1 = require("./order.interface");
exports.orderItemSchema = zod_1.z.object({
    book: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid book ObjectId"),
    quantity: zod_1.z.number().int().min(1, "Quantity must be at least 1"),
});
exports.shippingInfoSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required"),
    email: zod_1.z.string().email("Invalid email address"),
    address: zod_1.z.string().min(1, "Address is required"),
    phone: zod_1.z.string().min(5, "Phone number is too short"),
    division: zod_1.z.string().min(1, "Division is required"),
    district: zod_1.z.string().min(1, "District is required"),
    city: zod_1.z.string().min(1, "City is required"),
});
exports.createOrderSchema = zod_1.z.object({
    items: zod_1.z.array(exports.orderItemSchema).min(1, "At least one item is required"),
    shippingInfo: exports.shippingInfoSchema,
    paymentMethod: zod_1.z.nativeEnum(order_interface_1.PaymentMethod).default(order_interface_1.PaymentMethod.COD),
    paymentStatus: zod_1.z.nativeEnum(order_interface_1.PaymentStatus).default(order_interface_1.PaymentStatus.Pending),
});
exports.updateOrderStatusZodSchema = zod_1.z.object({
    status: zod_1.z.nativeEnum(order_interface_1.OrderStatus),
});
exports.updatePaymentStatusZodSchema = zod_1.z.object({
    paymentStatus: zod_1.z.nativeEnum(order_interface_1.PaymentStatus),
});
