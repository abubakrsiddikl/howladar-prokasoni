/* eslint-disable @typescript-eslint/no-explicit-any */
import { Order } from "./order.model";
import { IOrder } from "./order.interface";
import { Book } from "../book/book.model";
import AppError from "../../errorHelper/AppError";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { Role } from "../user/user.interface";
import { generateOrderId } from "../../utils/generateOrderId";

const createOrder = async (payload: IOrder, decodedToken: JwtPayload) => {
  const session = await Book.startSession();
  session.startTransaction();

  try {
    if (decodedToken.role !== Role.CUSTOMER) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "Only customers can place orders!"
      );
    }

    let totalAmount = 0;

    // Validate each book & calculate total
    for (const item of payload.items) {
      const book = await Book.findById(item.book).session(session);

      if (!book) {
        throw new AppError(
          httpStatus.NOT_FOUND,
          `Book not found: ${item.book}`
        );
      }

      // Stock check
      if (book.stock < item.quantity) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          `Not enough stock for book: ${book.title}`
        );
      }

      // Add to total
      totalAmount += book.price * item.quantity;
    }

    // Prepare order data
    const orderData = {
      ...payload,
      user: decodedToken.userId,
      totalAmount,
      orderId: await generateOrderId(),
    };

    // Create order within transaction
    const [order] = await Order.create([orderData], { session });

    // Update stock after order creation
    for (const item of payload.items) {
      await Book.findByIdAndUpdate(
        item.book,
        { $inc: { stock: -item.quantity } },
        { session }
      );
    }

    await session.commitTransaction();
    return order;
  } catch (error: any) {
    await session.abortTransaction();
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  } finally {
    session.endSession();
  }
};

const getAllOrders = async () => {
  return await Order.find().populate("user").populate("items.book");
};

const getSingleOrder = async (orderId: string) => {
  return await Order.findOne({ orderId })
    .populate("user")
    .populate("items.book");
};

// Update order status
const updateOrderStatus = async (orderId: string, status: string) => {
  const orderStatus = await Order.findByIdAndUpdate(
    orderId,
    { orderStatus: status },
    { new: true }
  );
  return orderStatus;
};

const deleteOrder = async (id: string) => {
  return await Order.findByIdAndDelete(id);
};

export const OrderService = {
  createOrder,
  getAllOrders,
  getSingleOrder,
  updateOrderStatus,
  deleteOrder,
};
