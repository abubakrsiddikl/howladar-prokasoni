import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { BannerServices } from "./banner.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

export const createBanner = catchAsync(async (req: Request, res: Response) => {
  const banner = await BannerServices.createBanner(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Banner created successfully",
    data: banner,
  });
});

export const getAllBanners = catchAsync(async (req: Request, res: Response) => {
  const banners = await BannerServices.getAllBanners();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Banners retrieved successfully",
    data: banners,
  });
});

export const getActiveBanners = catchAsync(
  async (req: Request, res: Response) => {
    const banners = await BannerServices.getActiveBanners();
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Active banners retrieved successfully",
      data: banners,
    });
  }
);

export const updateBanner = catchAsync(async (req: Request, res: Response) => {
  const banner = await BannerServices.updateBanner(req.params.id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Banner updated successfully",
    data: banner,
  });
});

export const deleteBanner = catchAsync(async (req: Request, res: Response) => {
  await BannerServices.deleteBanner(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Banner deleted successfully",
    data: null,
  });
});
