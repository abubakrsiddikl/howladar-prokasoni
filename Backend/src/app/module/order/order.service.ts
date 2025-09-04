/* eslint-disable @typescript-eslint/no-explicit-any */
import { Order } from "./order.model";
import { IOrder } from "./order.interface";
import { Book } from "../book/book.model";
import AppError from "../../errorHelper/AppError";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { Role } from "../user/user.interface";
import { generateOrderId } from "../../utils/generateOrderId";
import { User } from "../user/user.model";
import { sendEmail } from "../../utils/sendEmail";

const createOrder = async (payload: IOrder, decodedToken: JwtPayload) => {
  const session = await Book.startSession();

  try {
    session.startTransaction();
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
    const user = await User.findById(decodedToken.userId, "-password").session(
      session
    );
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }
    const adminsAndStoreManagers = await User.find({
      role: { $in: [Role.ADMIN, Role.STORE_MANAGER] },
    });

    const adminsAndStoreManagersEmails = adminsAndStoreManagers.map(
      (admin) => admin.email
    );
    // Notify admins and store managers about the new order
    await sendEmail({
      to: adminsAndStoreManagersEmails.join(", "),
      subject: "New Order Created",
      templateName: "adminOrderEmail",
      templateData: {
        orderId: order.orderId,
        customerName: user.name,
        total: order.totalAmount,
        phone: payload.shippingInfo.phone || user.phone,
        paymentMethod: order.paymentMethod,
        shippingAddress: payload.shippingInfo.address,
        city: payload.shippingInfo.city,
        district: payload.shippingInfo.district,
        division: payload.shippingInfo.division,
      },
    });
    // Notify the customer about their order
    await sendEmail({
      to: user.email,
      subject: "Order Confirmation",
      templateName: "customerOrderEmail",
      templateData: {
        orderId: order.orderId,
        customerName: user.name,
        total: order.totalAmount,
        phone: payload.shippingInfo.phone || user.phone,
        paymentMethod: order.paymentMethod,
        shippingAddress: payload.shippingInfo.address,
        city: payload.shippingInfo.city,
        district: payload.shippingInfo.district,
        division: payload.shippingInfo.division,
      },
    });
    return order;
  } catch (error: any) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    // await session.abortTransaction();
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  } finally {
    session.endSession();
  }
};

// get order by customer id
const getMyOrders = async (decodedToken: JwtPayload) => {
  const orders = await Order.find({ user: decodedToken?.userId }).populate("items.book","title coverImage");
  return orders;
};

// get all order
const getAllOrders = async () => {
  return await Order.find().populate("user").populate("items.book");
};

const getTraceOrder = async (orderId: string) => {
  return await Order.findOne({ orderId }).select("orderStatus createdAt -_id");
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

// Update payment status
const updatePaymentStatus = async (orderId: string, paymentStatus: string) => {
  const updatedOrder = await Order.findByIdAndUpdate(
    orderId,
    { paymentStatus: paymentStatus },
    { new: true, runValidators: true }
  );
  return updatedOrder;
};

// delete orders
const deleteOrder = async (id: string) => {
  return await Order.findByIdAndDelete(id);
};

export const OrderService = {
  createOrder,
  getMyOrders,
  getTraceOrder,
  getAllOrders,
  getSingleOrder,
  updateOrderStatus,
  updatePaymentStatus,
  deleteOrder,
};
