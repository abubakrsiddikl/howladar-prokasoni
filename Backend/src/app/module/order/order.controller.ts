import { catchAsync } from "../../utils/catchAsync";
import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { OrderService } from "./order.service";

import { sendResponse } from "../../utils/sendResponse";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHelper/AppError";

const createOrder = catchAsync(async (req: Request, res: Response) => {
  const decodedToken = req.user;

  const order = await OrderService.createOrder(
    req.body,
    decodedToken as JwtPayload
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Order created successfully",
    data: order,
  });
});

// get customer order her create
const getMyOrders = catchAsync(async (req: Request, res: Response) => {
  const decodedToken = req.user as JwtPayload;
  const orders = await OrderService.getMyOrders(decodedToken);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Orders retrieved successfully",
    data: orders,
  });
});
const getAllOrders = catchAsync(async (req: Request, res: Response) => {
  const orders = await OrderService.getAllOrders();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Orders retrieved successfully",
    data: orders,
  });
});

// order trace
const getTraceOrder = catchAsync(async (req: Request, res: Response) => {
  const orderId = req.params.orderId;
  if (!orderId) {
    throw new AppError(httpStatus.BAD_REQUEST, "Order ID is required");
  }
  const order = await OrderService.getTraceOrder(orderId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Order traced successfully",
    data: order,
  });
});

const getSingleOrder = catchAsync(async (req: Request, res: Response) => {
  const orderId = req.params.orderId;
  if (!orderId) {
    throw new AppError(httpStatus.BAD_REQUEST, "Order ID is required");
  }

  const order = await OrderService.getSingleOrder(orderId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Order retrieved successfully",
    data: order,
  });
});

const updateOrderStatus = catchAsync(async (req: Request, res: Response) => {
  const orderId = req.params.orderId;
  if (!orderId) {
    throw new AppError(httpStatus.BAD_REQUEST, "Order ID is required");
  }
  const updatedOrder = await OrderService.updateOrderStatus(
    orderId,
    req.body.orderStatus
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Order status updated successfully",
    data: updatedOrder,
  });
});

// update payment status
const updatePaymentStatus = catchAsync(async (req: Request, res: Response) => {
  const orderId = req.params.orderId;
  if (!orderId) {
    throw new AppError(httpStatus.BAD_REQUEST, "Order ID is required");
  }
  const updatedOrder = await OrderService.updatePaymentStatus(
    orderId,
    req.body.paymentStatus
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment status updated successfully",
    data: updatedOrder,
  });
});

export const OrderController = {
  createOrder,
  getMyOrders,
  getTraceOrder,
  getAllOrders,
  getSingleOrder,
  updateOrderStatus,
  updatePaymentStatus,
};
