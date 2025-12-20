import { ClientSession } from "mongoose";
import { uploadBufferToCloudinary } from "../config/cloudinary.config";
import { IOrder } from "../module/order/order.interface";
import { Order } from "../module/order/order.model";
import { generateOrderInvoicePDF } from "./invoice";

export const saveInvoiceURLToDB = async (
  orderId: string,
  session?: ClientSession
) => {
  const order = await Order.findById(orderId)
    .populate("items.book")
    .session(session as ClientSession);

  // generate pdf buffer
  const pdfBuffer = await generateOrderInvoicePDF(order as IOrder);
  // generate invoice pdf url
  const invoiceURL = await uploadBufferToCloudinary(pdfBuffer, "invoice");
  
  await Order.updateOne(
    { _id: orderId },
    { invoiceURL: invoiceURL?.secure_url }
  ).session(session as ClientSession);
  return console.log("✅ Invoice URL save done to db ");
};
