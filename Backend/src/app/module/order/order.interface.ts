import { Types } from "mongoose";

export enum PaymentMethod {
  COD = "COD",
  SSLCommerz = "SSLCommerz",
}

export enum PaymentStatus {
  Paid = "Paid",
  Pending = "Pending",
}

export enum OrderStatus {
  Processing = "Processing",
  Shipped = "Shipped",
  Delivered = "Delivered",
  Cancelled = "Cancelled",
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
  totalAmount: number;
  orderStatus: OrderStatus;
  orderId: string;
}
