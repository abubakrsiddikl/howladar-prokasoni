/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { CampaignServices } from "./campaign.service";

const createCampaign = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const file = req.file?.path;
    // console.log(req.body,"body")
    const result = await CampaignServices.createCampaign({
      ...req.body,
      bannerImage: file,
    });

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Campaign created successfully",
      data: result,
    });
  },
);

const getAllCampaigns = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await CampaignServices.getAllCampaigns(
      req.query as Record<string, string>,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Campaigns retrieved successfully",
      data: result.data,
      meta: result.meta,
    });
  },
);

const getActiveCampaigns = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await CampaignServices.getActiveCampaigns();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Active campaigns retrieved successfully",
      data: result,
    });
  },
);

const getCampaignBySlug = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await CampaignServices.getCampaignBySlug(
      req.params.slug as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Campaign retrieved successfully",
      data: result,
    });
  },
);

const getCampaignById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await CampaignServices.getCampaignById(
      req.params.id as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Campaign retrieved successfully",
      data: result,
    });
  },
);

const updateCampaign = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const file = req.file?.path;
    const payload = {
      ...req.body,
      bannerImage: file,
    };
    const result = await CampaignServices.updateCampaign(
      req.params.id as string,
      payload,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Campaign updated successfully",
      data: result,
    });
  },
);

const updateCampaignStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await CampaignServices.updateCampaignStatus(
      req.params.id as string,
      req.body.isActive,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Campaign status updated successfully",
      data: result,
    });
  },
);

const deleteCampaign = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await CampaignServices.deleteCampaign(req.params.id as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Campaign deleted successfully",
      data: null,
    });
  },
);

export const CampaignControllers = {
  createCampaign,
  getAllCampaigns,
  getActiveCampaigns,
  getCampaignBySlug,
  getCampaignById,
  updateCampaign,
  updateCampaignStatus,
  deleteCampaign,
};
