import { Schema, model } from "mongoose";
import {
  IOrder,
  PaymentMethod,
  PaymentStatus,
  OrderStatus,
  IOrderStatusLog,
} from "./order.interface";

const orderStatusLogSchema = new Schema<IOrderStatusLog>(
  {
    status: {
      type: String,
      enum: Object.values(OrderStatus),
      required: true,
    },
    location: {
      type: String,
      trim: true,
    },
    note: {
      type: String,
      trim: true,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

// order item schema
const orderItemSchema = new Schema(
  {
    book: { type: Schema.Types.ObjectId, ref: "Book", required: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

// shipping schema
const shippingInfoSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    division: { type: String, required: true },
    district: { type: String, required: true },
    city: { type: String, required: true },
  },
  { _id: false }
);

const orderSchema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    items: { type: [orderItemSchema], required: true },
    shippingInfo: { type: shippingInfoSchema, required: true },
    paymentMethod: {
      type: String,
      enum: Object.values(PaymentMethod),
      required: true,
      default: PaymentMethod.COD,
    },
    paymentStatus: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING,
    },
    totalAmount: { type: Number, required: true, min: 0 },
    deliveryCharge: { type: Number, default: 120 },
    orderStatusLog: [orderStatusLogSchema],
    currentStatus: { type: String, default: OrderStatus.Processing },
    orderId: { type: String, required: true, unique: true },
    totalDiscountedPrice: { type: Number, required: true, default: 0 },
    paymentGateway: {
      type: Schema.Types.Mixed,
    },
    transactionId: { type: String, required: false, unique: true },
  },
  { timestamps: true }
);

export const Order = model<IOrder>("Order", orderSchema);
