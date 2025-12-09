import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

import httpStatus from "http-status-codes";
import { StatsServices } from "./stats.service";
import { JwtPayload } from "jsonwebtoken";
const getCustomerDashboardStats = catchAsync(
  async (req: Request, res: Response) => {
    const customerId = req.user as JwtPayload;
    const stats = await StatsServices.getCustomerDashboardStats(customerId);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Order statistics retrieved successfully",
      data: stats,
    });
  }
);
const getStats = catchAsync(async (_req: Request, res: Response) => {
  const stats = await StatsServices.getStats();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Order statistics retrieved successfully",
    data: stats,
  });
});
const getMonthlySalesStatsController = catchAsync(
  async (_req: Request, res: Response) => {
    const stats = await StatsServices.getMonthlySalesStats();
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Monthly sales stats retrieved successfully",
      data: stats,
    });
  }
);

export const StatsControllers = {
  getCustomerDashboardStats,
  getStats,
  getMonthlySalesStatsController,
};
