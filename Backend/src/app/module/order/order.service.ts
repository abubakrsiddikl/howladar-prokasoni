/* eslint-disable @typescript-eslint/no-explicit-any */
import { Order } from "./order.model";
import {
  IOrder,
  IOrderStatusLog,
  OrderStatus,
  PaymentStatus,
} from "./order.interface";
import { Book } from "../book/book.model";
import AppError from "../../errorHelper/AppError";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { Role } from "../user/user.interface";
import { generateOrderId } from "../../utils/generateOrderId";
import { User } from "../user/user.model";
import { sendEmail } from "../../utils/sendEmail";
import { orderSearchableFields } from "./order.constant";
import { QueryBuilder } from "../../utils/QueryBuilder";

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

    const initialOrderStatusLog: IOrderStatusLog = {
      status: OrderStatus.Processing,
      location: "N/A",
      note: "অর্ডারটি গ্রহণ করা হয়েছে। কনফার্মেশনের জন্য অপেক্ষমান।",
      timestamp: new Date(),
    };
    // delivery charge include of totalAmount
    const deliveryCharge = payload.deliveryCharge ?? 120;
    const subTotal = totalAmount + deliveryCharge;
    // Prepare order data
    const orderData = {
      ...payload,
      user: decodedToken.userId,
      totalAmount: subTotal,
      orderStatusLog: [initialOrderStatusLog],
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
  const orders = await Order.find({ user: decodedToken?.userId })
    .sort("-createdAt")
    .populate("items.book", "title coverImage");
  return orders;
};

// get all order
const getAllOrders = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(Order.find(), query);

  await queryBuilder.filter();
  queryBuilder.search(orderSearchableFields).sort().paginate();

  const [data, meta] = await Promise.all([
    queryBuilder.build().populate("user", "-password").populate("items.book"),
    queryBuilder.getMeta(),
  ]);

  return { data, meta };
};

const getTraceOrder = async (orderId: string) => {
  return await Order.findOne({ orderId }).select(
    "orderStatusLog createdAt -_id"
  );
};
const getSingleOrder = async (orderId: string) => {
  return await Order.findOne({ orderId })
    .populate("user")
    .populate("items.book");
};

// Update order status
// Allowed status transitions
const allowedStatusFlow: Record<OrderStatus, OrderStatus[]> = {
  Processing: [OrderStatus.Approved, OrderStatus.Cancelled],
  Approved: [OrderStatus.Shipped, OrderStatus.Cancelled],
  Shipped: [OrderStatus.Delivered],
  Delivered: [OrderStatus.Returned],
  Cancelled: [],
  Returned: [],
};

// Status এর note
const statusNotes: Record<OrderStatus, string> = {
  Processing: "অর্ডারটি গ্রহণ করা হয়েছে। কনফার্মেশনের জন্য অপেক্ষমান।",
  Approved: "অর্ডারটি প্রস্তুত করা হচ্ছে",
  Shipped: "অর্ডারটি কুরিয়ারের কাছে দেয়া হয়েছে",
  Delivered: "অর্ডারটি ডেলিভারি দেয়া হয়েছে",
  Cancelled: "অর্ডারটি বাতিল করা হয়েছে",
  Returned: "অর্ডারটি কাস্টমার দ্বারা ফেরত দেয়া হয়েছে",
};

// Update order status function
const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new AppError(httpStatus.NOT_FOUND, "অর্ডারটি পাওয়া যায়নি");
  }

  if (order.currentStatus === newStatus) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `অর্ডারের স্ট্যাটাস ইতিমধ্যেই ${newStatus}`
    );
  }

  // Check duplicate in log
  const isDuplicate = order.orderStatusLog.some(
    (item) => item.status === newStatus
  );
  if (isDuplicate) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `অর্ডারের স্ট্যাটাস ইতিমধ্যেই ${newStatus}`
    );
  }

  // Check allowed status flow
  const allowedNextStatus =
    allowedStatusFlow[order.currentStatus as OrderStatus];
  if (!allowedNextStatus.includes(newStatus)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `অর্ডারের স্ট্যাটাস ${order.currentStatus} থেকে ${newStatus} সম্ভব নয়`
    );
  }

  // Update status & add note
  order.currentStatus = newStatus;
  if (newStatus === OrderStatus.Delivered) {
    order.paymentStatus = PaymentStatus.Paid;
  }

  // update order status is Cancelled to update  payment status by Cancelled

  if (
    newStatus === OrderStatus.Cancelled ||
    newStatus === OrderStatus.Returned
  ) {
    order.paymentStatus = PaymentStatus.Cancelled;
  }

  order.orderStatusLog.push({
    status: newStatus,
    note: statusNotes[newStatus],
    timestamp: new Date(),
  });

  await order.save();
  return order;
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
