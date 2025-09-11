import { Book } from "../book/book.model";
import { Order } from "../order/order.model";

const getStats = async () => {
  // Total users who placed orders
  const totalUsers = await Order.distinct("user").then((arr) => arr.length);

  //   Total Book
  const totalBook = await Book.countDocuments();

  // Count orders by currentStatus
  const statusStats = await Order.aggregate([
    {
      $group: {
        _id: "$currentStatus",
        count: { $sum: 1 },
      },
    },
  ]);

  // Total orders
  const totalOrders = await Order.countDocuments();

  return {
    totalOrders,
    totalUsers,
    totalBook,
    statusStats: statusStats.map((s) => ({ status: s._id, count: s.count })),
  };
};

// Monthly sales & revenue stats
const getMonthlySalesStats = async () => {
  const stats = await Order.aggregate([
    {
      $match: { paymentStatus: "Paid" }, // শুধু Paid order
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

export const StatsServices = {
  getStats,
  getMonthlySalesStats,
};
