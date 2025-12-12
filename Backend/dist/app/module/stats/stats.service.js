"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatsServices = void 0;
const mongoose_1 = require("mongoose");
const book_model_1 = require("../book/book.model");
const order_model_1 = require("../order/order.model");
const user_model_1 = require("../user/user.model");
const getCustomerDashboardStats = (decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const customerId = new mongoose_1.Types.ObjectId(decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.userId);
    const totalOrders = yield order_model_1.Order.countDocuments({ user: customerId });
    const statusStats = yield order_model_1.Order.aggregate([
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
    const lastOrder = yield order_model_1.Order.findOne({ user: customerId })
        .sort({ createdAt: -1 })
        .select("orderId currentStatus createdAt totalAmount")
        .lean();
    // 4.  (Total Lifetime Spend)
    const lifetimeSpend = yield order_model_1.Order.aggregate([
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
        totalLifetimeSpend: lifetimeSpend.length > 0 ? lifetimeSpend[0].totalSpend : 0,
    };
});
// get admin
const getStats = () => __awaiter(void 0, void 0, void 0, function* () {
    // Total users who placed orders
    // const totalUsers = await Order.distinct("user").then((arr) => arr.length);
    const totalUsers = yield user_model_1.User.countDocuments();
    //   Total Book
    const totalBook = yield book_model_1.Book.countDocuments();
    // Count orders by currentStatus
    const allStatuses = [
        "Processing",
        "Approved",
        "Shipped",
        "Delivered",
        "Cancelled",
        "Returned",
    ];
    const statusStats = yield order_model_1.Order.aggregate([
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
    const paymentRevenueStats = yield order_model_1.Order.aggregate([
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
    const totalOrders = yield order_model_1.Order.countDocuments();
    return {
        totalOrders,
        totalUsers,
        totalBook,
        statusStats: currentStatusByCount,
        revenue: paymentStatsWithAll,
    };
});
// Monthly sales & revenue stats
const getMonthlySalesStats = () => __awaiter(void 0, void 0, void 0, function* () {
    const stats = yield order_model_1.Order.aggregate([
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
});
exports.StatsServices = {
    getCustomerDashboardStats,
    getStats,
    getMonthlySalesStats,
};
