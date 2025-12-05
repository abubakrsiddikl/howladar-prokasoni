import { Banner } from "./banner.model";
import { IBanner } from "./banner.interface";
import AppError from "../../errorHelper/AppError";
import httpStatus from "http-status-codes";
import { deleteImageFromCLoudinary } from "../../config/cloudinary.config";
import { QueryBuilder } from "../../utils/QueryBuilder";

const createBanner = async (payload: IBanner) => {
  const banner = await Banner.create(payload);
  return banner;
};

const getAllBanners = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(Banner.find(), query);

  await queryBuilder.filter();
  queryBuilder.search(["title"]).sort().paginate();

  const [data, meta] = await Promise.all([
    queryBuilder.build(),
    queryBuilder.getMeta(),
  ]);

  return { data, meta };
};

const getActiveBanners = async () => {
  const today = new Date();
  return await Banner.find({
    active: true,
    $or: [
      { startDate: { $lte: today }, endDate: { $gte: today } },
      { startDate: null, endDate: null },
    ],
  }).sort({ createdAt: -1 });
};

const getBannerById = async (id: string) => {
  return await Banner.findById(id);
};

const updateBanner = async (id: string, payload: Partial<IBanner>) => {
  const existingBanner = await Banner.findById(id);
  if (!existingBanner) {
    throw new AppError(httpStatus.NOT_FOUND, "Banner not found");
  }

  const updatedBanner = await Banner.findByIdAndUpdate(id, payload, {
    new: true,
  });
  if (payload.image && existingBanner.image) {
    await deleteImageFromCLoudinary(existingBanner.image);
  }
  return updatedBanner;
};

const deleteBanner = async (id: string) => {
  const banner = await Banner.findById(id);
  if (!banner) {
    throw new AppError(httpStatus.NOT_FOUND, "Banner not found");
  }
  await deleteImageFromCLoudinary(banner.image);
  return await Banner.findByIdAndDelete(id);
};

export const BannerServices = {
  createBanner,
  getAllBanners,
  getActiveBanners,
  getBannerById,
  updateBanner,
  deleteBanner,
};
