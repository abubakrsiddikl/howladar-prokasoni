import { Banner } from "./banner.model";
import { IBanner } from "./banner.interface";

const createBanner = async (payload: IBanner) => {
  const banner = await Banner.create(payload);
  return banner;
};

const getAllBanners = async () => {
  return await Banner.find({}).sort({ createdAt: -1 });
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
  return await Banner.findByIdAndUpdate(id, payload, { new: true });
};

const deleteBanner = async (id: string) => {
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
