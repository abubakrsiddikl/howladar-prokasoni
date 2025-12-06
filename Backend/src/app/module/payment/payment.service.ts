/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status-codes";

import { Order } from "../order/order.model";
import {
  IOrderStatusLog,
  OrderStatus,
  PaymentStatus,
} from "../order/order.interface";
import AppError from "../../errorHelper/AppError";
import { Book } from "../book/book.model";

const successPayment = async (query: Record<string, string>) => {
  const session = await Order.startSession();
  session.startTransaction();

  const transactionId = query.tran_id;

  try {
    if (!transactionId) {
      throw new AppError(httpStatus.BAD_REQUEST, "Missing transaction ID.");
    }

    const updateOrderStatusLog: IOrderStatusLog = {
      status: OrderStatus.Approved,
      location: "Online Payment Gateway",
      note: "অনলাইন পেমেন্ট সফল হয়েছে। অর্ডারটি প্রস্তুত করা হচ্ছে।",
      timestamp: new Date(),
    };

    const updatedOrder = await Order.findOneAndUpdate(
      { transactionId: transactionId },
      {
        paymentStatus: PaymentStatus.PAID,
        currentStatus: OrderStatus.Approved,
        $push: { orderStatusLog: updateOrderStatusLog },
      },
      { new: true, session: session }
    );

    if (!updatedOrder) {
      throw new AppError(httpStatus.NOT_FOUND, "Order not found!");
    }

    await session.commitTransaction();
    session.endSession();
    return {
      success: true,
      message: "Payment Completed Successfully",
      orderId: updatedOrder.orderId,
    };
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    throw new AppError(
      error.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
      error.message
    );
  }
};

// ssl fail


const failPayment = async (query: Record<string, string>) => {

  if (query.status === "cancel" || query.status === "CANCELLED") {
    return await PaymentService.cancelPayment(query);
  }
  const session = await Order.startSession();
  session.startTransaction();

  const transactionId = query.tran_id || query.transactionId;

  try {
    const updateOrderStatusLog: IOrderStatusLog = {
      status: OrderStatus.Cancelled,
      location: "Online Payment Gateway",
      note: "অনলাইন পেমেন্ট ব্যর্থ হয়েছে, তাই অর্ডারটি বাতিল করা হলো ।",
      timestamp: new Date(),
    };

    const updatedOrder = await Order.findOneAndUpdate(
      { transactionId },
      {
        paymentStatus: PaymentStatus.FAILED,
        currentStatus: OrderStatus.Cancelled,
        $push: { orderStatusLog: updateOrderStatusLog },
      },
      { new: true, session }
    );
    if (!updatedOrder) {
      await session.abortTransaction();
      session.endSession();
      throw new AppError(500, "Order update failed!");
    }

    // Restore stock
    for (const item of updatedOrder.items) {
      await Book.findByIdAndUpdate(
        item.book,
        { $inc: { stock: item.quantity } },
        { session }
      );
    }

    await session.commitTransaction();
    session.endSession();
    return {
      success: false,
      message: "Payment Failed and Order Cancelled",
      orderId: updatedOrder?.orderId,
    };
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    throw new AppError(error.statusCode || 500, error.message);
  }
};



// ssl cancel
const cancelPayment = async (query: Record<string, string>) => {
  const session = await Order.startSession();
  session.startTransaction();

  const transactionId = query.tran_id || query.transactionId;

  try {
    const updateOrderStatusLog: IOrderStatusLog = {
      status: OrderStatus.Cancelled,
      location: "Customer Initiated / Payment Gateway",
      note: "কাস্টমার কর্তৃক পেমেন্ট বাতিল করা হয়েছে, তাই অর্ডারটি বাতিল করা হলো।",
      timestamp: new Date(),
    };

    const updatedOrder = await Order.findOneAndUpdate(
      {
        transactionId: transactionId,
        currentStatus: { $in: [OrderStatus.Processing, OrderStatus.Approved] },
      },
      {
        paymentStatus: PaymentStatus.CANCELLED,
        currentStatus: OrderStatus.Cancelled,
        $push: { orderStatusLog: updateOrderStatusLog },
      },
      { new: true, session }
    );

    if (!updatedOrder) {
      await session.abortTransaction();
      session.endSession();
      return {
        success: false,
        message: "Order already cancelled. No further action needed.",
        orderId: transactionId,
      };
    }

    // Restore stock (এই ব্লকটি এখন শুধুমাত্র একবারই চলবে)
    for (const item of updatedOrder.items) {
      await Book.findByIdAndUpdate(
        item.book,
        { $inc: { stock: item.quantity } },
        { session }
      );
    }

    await session.commitTransaction();
    session.endSession();
    return {
      success: false,
      message: "Payment Cancelled and Order Cancelled",
      orderId: updatedOrder?.orderId,
    };
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    throw new AppError(error.statusCode || 500, error.message);
  }
};

export const PaymentService = {
  successPayment,
  failPayment,
  cancelPayment,
};
