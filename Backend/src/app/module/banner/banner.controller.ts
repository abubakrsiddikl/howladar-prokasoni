import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { BannerServices } from "./banner.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { IBanner } from "./banner.interface";

const createBanner = catchAsync(async (req: Request, res: Response) => {
  const payload: IBanner = {
    ...req.body,
    image: req.file?.path,
  };
  const banner = await BannerServices.createBanner(payload);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Banner created successfully",
    data: banner,
  });
});

const getAllBanners = catchAsync(async (req: Request, res: Response) => {
  const banners = await BannerServices.getAllBanners();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Banners retrieved successfully",
    data: banners,
  });
});

const getActiveBanners = catchAsync(async (req: Request, res: Response) => {
  const banners = await BannerServices.getActiveBanners();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Active banners retrieved successfully",
    data: banners,
  });
});

const updateBanner = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const payload: IBanner = {
    ...req.body,
    image: req.file?.path,
  };
  const banner = await BannerServices.updateBanner(id, payload);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Banner updated successfully",
    data: banner,
  });
});

const deleteBanner = catchAsync(async (req: Request, res: Response) => {
  await BannerServices.deleteBanner(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Banner deleted successfully",
    data: null,
  });
});

export const BannerControllers = {
  createBanner,
  getAllBanners,
  getActiveBanners,
  updateBanner,
  deleteBanner,
};
