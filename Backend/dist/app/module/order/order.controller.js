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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const order_service_1 = require("./order.service");
const sendResponse_1 = require("../../utils/sendResponse");
const AppError_1 = __importDefault(require("../../errorHelper/AppError"));
const createOrder = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const order = yield order_service_1.OrderService.createOrder(req.body, decodedToken);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.CREATED,
        success: true,
        message: "Order created successfully",
        data: order,
    });
}));
// get customer order her create
const getMyOrders = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const orders = yield order_service_1.OrderService.getMyOrders(decodedToken);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Orders retrieved successfully",
        data: orders,
    });
}));
const getAllOrders = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield order_service_1.OrderService.getAllOrders(req.query);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Orders retrieved successfully",
        data: orders.data,
        meta: orders.meta,
    });
}));
// order trace
const getTraceOrder = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const orderId = req.params.orderId;
    if (!orderId) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Order ID is required");
    }
    const order = yield order_service_1.OrderService.getTraceOrder(orderId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Order traced successfully",
        data: order,
    });
}));
const getSingleOrder = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const orderId = req.params.orderId;
    if (!orderId) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Order ID is required");
    }
    const order = yield order_service_1.OrderService.getSingleOrder(orderId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Order retrieved successfully",
        data: order,
    });
}));
const updateOrderStatus = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const orderId = req.params.id;
    if (!orderId) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Order ID is required");
    }
    const updatedOrder = yield order_service_1.OrderService.updateOrderStatus(orderId, req.body.status);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Order status updated successfully",
        data: updatedOrder,
    });
}));
// update payment status
const updatePaymentStatus = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const orderId = req.params.orderId;
    if (!orderId) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Order ID is required");
    }
    const updatedOrder = yield order_service_1.OrderService.updatePaymentStatus(orderId, req.body.paymentStatus);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Payment status updated successfully",
        data: updatedOrder,
    });
}));
exports.OrderController = {
    createOrder,
    getMyOrders,
    getTraceOrder,
    getAllOrders,
    getSingleOrder,
    updateOrderStatus,
    updatePaymentStatus,
};
