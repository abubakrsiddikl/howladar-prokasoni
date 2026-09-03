import { Types } from "mongoose";
import { Book } from "../book/book.model";
import { Order } from "../order/order.model";
import { User } from "../user/user.model";
import { JwtPayload } from "jsonwebtoken";

const getCustomerDashboardStats = async (decodedToken: JwtPayload) => {
  const customerId = new Types.ObjectId(decodedToken?.userId);

  const totalOrders = await Order.countDocuments({ user: customerId });

  const statusStats = await Order.aggregate([
    {
      $match: { user: customerId },
    },
    {
      $group: {
        _id: "$currentStatus",
        count: { $sum: 1 },
      },
    },
  ]);

  const allStatuses = [
    "Processing",
    "Approved",
    "Shipped",
    "Delivered",
    "Cancelled",
    "Returned",
  ];

  const currentStatusByCount = allStatuses.map((status) => {
    const stat = statusStats.find((s) => s._id === status);
    return { status, count: stat ? stat.count : 0 };
  });

  const lastOrder = await Order.findOne({ user: customerId })
    .sort({ createdAt: -1 })
    .select("orderId currentStatus createdAt totalAmount")
    .lean();

  // 4.  (Total Lifetime Spend)
  const lifetimeSpend = await Order.aggregate([
    {
      $match: {
        user: customerId,
        paymentStatus: "PAID",
      },
    },
    {
      $group: {
        _id: null,
        totalSpend: { $sum: "$totalAmount" },
      },
    },
  ]);

  return {
    totalOrders,
    orderStatusStats: currentStatusByCount,
    lastOrder: lastOrder
      ? {
          orderId: lastOrder.orderId,
          status: lastOrder.currentStatus,
          amount: lastOrder.totalAmount,
          date: lastOrder.createdAt,
        }
      : null,
    totalLifetimeSpend:
      lifetimeSpend.length > 0 ? lifetimeSpend[0].totalSpend : 0,
  };
};

// get admin
const getStats = async () => {
  // Total users who placed orders
  // const totalUsers = await Order.distinct("user").then((arr) => arr.length);
  const totalUsers = await User.countDocuments();

  //   Total Book
  const totalBook = await Book.countDocuments();

  // Count orders by currentStatus
  const allStatuses = [
    "Processing",
    "Approved",
    "Shipped",
    "Delivered",
    "Cancelled",
    "Returned",
  ];

  const statusStats = await Order.aggregate([
    {
      $group: {
        _id: "$currentStatus",
        count: { $sum: 1 },
      },
    },
  ]);

  // Map results to ensure all statuses are present
  const currentStatusByCount = allStatuses.map((status) => {
    const stat = statusStats.find((s) => s._id === status);
    return { status, count: stat ? stat.count : 0 };
  });

  // total revenue by payment
  const allPaymentStatuses = ["PAID", "PENDING", "CANCELLED"];

  const paymentRevenueStats = await Order.aggregate([
    {
      $group: {
        _id: "$paymentStatus",
        totalRevenue: { $sum: "$totalAmount" },
        count: { $sum: 1 },
      },
    },
  ]);

  const paymentStatsWithAll = allPaymentStatuses.map((status) => {
    const stat = paymentRevenueStats.find((s) => s._id === status);
    return {
      status,
      count: stat ? stat.count : 0,
      totalAmount: stat ? stat.totalRevenue : 0,
    };
  });

  // Total orders
  const totalOrders = await Order.countDocuments();

  return {
    totalOrders,
    totalUsers,
    totalBook,
    statusStats: currentStatusByCount,
    revenue: paymentStatsWithAll,
  };
};

// Monthly sales & revenue stats
const getMonthlySalesStats = async () => {
  const stats = await Order.aggregate([
    {
      $match: { paymentStatus: "PAID" }, // শুধু Paid order
    },
    {
      $group: {
        _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
        totalOrders: { $sum: 1 },
        totalRevenue: { $sum: "$totalAmount" },
      },
    },
    {
      $sort: { "_id.year": 1, "_id.month": 1 }, // ascending by date
    },
  ]);

  //   response monthly
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return stats.map((item) => ({
    year: item._id.year,
    month: monthNames[item._id.month - 1],
    totalOrders: item.totalOrders,
    totalRevenue: item.totalRevenue,
  }));
};

// Daily sales trend (orders count + revenue) for the last N days
const getDailySalesStats = async (days = 14) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - (days - 1));
  startDate.setHours(0, 0, 0, 0);

  const stats = await Order.aggregate([
    {
      $match: { createdAt: { $gte: startDate } },
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
          day: { $dayOfMonth: "$createdAt" },
        },
        totalOrders: { $sum: 1 },
        totalRevenue: {
          $sum: {
            $cond: [{ $eq: ["$paymentStatus", "PAID"] }, "$totalAmount", 0],
          },
        },
      },
    },
    {
      $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 },
    },
  ]);

  // Fill in missing days with zero values so the chart has no gaps
  const result: { date: string; totalOrders: number; totalRevenue: number }[] = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    const found = stats.find(
      (s) =>
        s._id.year === d.getFullYear() &&
        s._id.month === d.getMonth() + 1 &&
        s._id.day === d.getDate()
    );
    result.push({
      date: `${d.getDate()}/${d.getMonth() + 1}`,
      totalOrders: found ? found.totalOrders : 0,
      totalRevenue: found ? found.totalRevenue : 0,
    });
  }

  return result;
};

export const StatsServices = {
  getCustomerDashboardStats,
  getStats,
  getMonthlySalesStats,
  getDailySalesStats,
};

