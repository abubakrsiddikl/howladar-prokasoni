import httpStatus from "http-status-codes";
import { ICampaign } from "./campaign.interface";
import { Campaign } from "./campaign.model";
import AppError from "../../errorHelper/AppError";
import { deleteImageFromCLoudinary } from "../../config/cloudinary.config";
import { Order } from "../order/order.model";
import { QueryBuilder } from "../../utils/QueryBuilder";

const createCampaign = async (payload: ICampaign) => {
  const existingCampaign = await Campaign.findOne({
    title: payload.title,
  });

  if (existingCampaign) {
    throw new AppError(
      httpStatus.CONFLICT,
      "A campaign with this title already exists",
    );
  }

  const campaign = await Campaign.create(payload);

  return campaign;
};

const getAllCampaigns = async (query: Record<string, string>) => {
   const queryBuilder = new QueryBuilder(Campaign.find(), query);
  
    await queryBuilder.filter();
    queryBuilder.search(["title"]).sort().paginate();
  
    const [data, meta] = await Promise.all([
      queryBuilder.build(),
      queryBuilder.getMeta(),
    ]);
  
    return { data, meta };
};

const getActiveCampaigns = async () => {
  return await Campaign.find({
    isActive: true,
  }).sort({ createdAt: -1 });
};

const getCampaignBySlug = async (slug: string) => {
  const campaign = await Campaign.findOne({
    slug,
    isActive: true,
  });

  if (!campaign) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Campaign not found or no longer active",
    );
  }

  return campaign;
};

const getCampaignById = async (campaignId: string) => {
  const campaign = await Campaign.findById(campaignId);

  if (!campaign) {
    throw new AppError(httpStatus.NOT_FOUND, "Campaign not found");
  }

  return campaign;
};

const updateCampaign = async (
  campaignId: string,
  payload: Partial<ICampaign>,
) => {
  // console.log(payload,campaignId)
  const campaignExists = await Campaign.findById(campaignId);

  if (!campaignExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Campaign not found");
  }

  // if (payload.slug && payload.slug !== campaignExists.slug) {
  //   const existingCampaign = await Campaign.findOne({
  //     slug: payload.slug,
  //     _id: { $ne: campaignId },
  //   });

  //   if (existingCampaign) {
  //     throw new AppError(
  //       httpStatus.CONFLICT,
  //       "A campaign with this slug already exists",
  //     );
  //   }
  // }

  if (payload.bannerImage) {
    // if cover image is provided, delete the old coverImage
    if (campaignExists.bannerImage) {
      await deleteImageFromCLoudinary(campaignExists.bannerImage);
    }
  } else {
    // if cover image is not provided, keep the existing coverImage
    payload.bannerImage = campaignExists.bannerImage;
  }

  const updatedCampaign = await Campaign.findByIdAndUpdate(
    campaignId,
    payload,
    {
      new: true,
      runValidators: true,
    },
  );

  return updatedCampaign;
};

const updateCampaignStatus = async (campaignId: string, isActive: boolean) => {
  const campaign = await Campaign.findByIdAndUpdate(
    campaignId,
    { isActive },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!campaign) {
    throw new AppError(httpStatus.NOT_FOUND, "Campaign not found");
  }

  return campaign;
};

const deleteCampaign = async (campaignId: string) => {
  const campaign = await Campaign.findById(campaignId);

  if (!campaign) {
    throw new AppError(httpStatus.NOT_FOUND, "Campaign not found");
  }

  if (campaign.bannerImage) {
    await deleteImageFromCLoudinary(campaign.bannerImage);
  }

  await Order.deleteMany({ campaignId: campaign._id });
  await Campaign.findByIdAndDelete(campaignId);

  return null;
};

export const CampaignServices = {
  createCampaign,
  getAllCampaigns,
  getActiveCampaigns,
  getCampaignBySlug,
  getCampaignById,
  updateCampaign,
  updateCampaignStatus,
  deleteCampaign,
};
