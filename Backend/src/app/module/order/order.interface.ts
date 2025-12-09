/* eslint-disable @typescript-eslint/no-explicit-any */
import { Types } from "mongoose";

export enum PaymentMethod {
  COD = "COD",
  SSLCommerz = "SSLCommerz",
}

export enum PaymentStatus {
  PAID = "PAID",
  PENDING = "PENDING",
  CANCELLED = "CANCELLED",
  FAILED = "FAILED",
}

export enum OrderStatus {
  Processing = "Processing",
  Approved = "Approved",
  Shipped = "Shipped",
  Delivered = "Delivered",
  Cancelled = "Cancelled",
  Returned = "Returned",
  Failed = "Failed",
}

export interface IOrderStatusLog {
  status: OrderStatus;
  location?: string;
  note?: string;
  updatedBy?: Types.ObjectId;
  timestamp?: Date;
}

export interface IOrderItem {
  book: Types.ObjectId;
  quantity: number;
}

export interface IShippingInfo {
  name: string;
  email: string;
  address: string;
  phone: string;
  division: string;
  district: string;
  city: string;
}

export interface IOrder {
  user: Types.ObjectId;
  items: IOrderItem[];
  shippingInfo: IShippingInfo;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  deliveryCharge: number;
  totalAmount: number;
  orderStatusLog: IOrderStatusLog[];
  currentStatus: string;
  orderId: string;
  totalDiscountedPrice: number;
  paymentGateway?: any;
  transactionId?: string;

  createdAt?: string;
}
