import { z } from "zod";
import { PaymentMethod, PaymentStatus, OrderStatus } from "./order.interface";

export const orderItemSchema = z.object({
  book: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid book ObjectId"),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
});

export const shippingInfoSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  address: z.string().min(1, "Address is required"),
  phone: z.string().min(5, "Phone number is too short"),
  division: z.string().min(1, "Division is required"),
  district: z.string().min(1, "District is required"),
  city: z.string().min(1, "City is required"),
});

export const createOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1, "At least one item is required"),
  shippingInfo: shippingInfoSchema,
  paymentMethod: z.nativeEnum(PaymentMethod).default(PaymentMethod.COD),
  paymentStatus: z.nativeEnum(PaymentStatus).default(PaymentStatus.Pending),
});

export const updateOrderStatusZodSchema = z.object({
  status: z.nativeEnum(OrderStatus),
});

export const updatePaymentStatusZodSchema = z.object({
  paymentStatus: z.nativeEnum(PaymentStatus),
});
