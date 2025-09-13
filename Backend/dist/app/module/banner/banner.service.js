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
exports.BannerServices = void 0;
const banner_model_1 = require("./banner.model");
const AppError_1 = __importDefault(require("../../errorHelper/AppError"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const cloudinary_config_1 = require("../../config/cloudinary.config");
const createBanner = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const banner = yield banner_model_1.Banner.create(payload);
    return banner;
});
const getAllBanners = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield banner_model_1.Banner.find({}).sort({ createdAt: -1 });
});
const getActiveBanners = () => __awaiter(void 0, void 0, void 0, function* () {
    const today = new Date();
    return yield banner_model_1.Banner.find({
        active: true,
        $or: [
            { startDate: { $lte: today }, endDate: { $gte: today } },
            { startDate: null, endDate: null },
        ],
    }).sort({ createdAt: -1 });
});
const getBannerById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield banner_model_1.Banner.findById(id);
});
const updateBanner = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existingBanner = yield banner_model_1.Banner.findById(id);
    if (!existingBanner) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Banner not found");
    }
    const updatedBanner = yield banner_model_1.Banner.findByIdAndUpdate(id, payload, {
        new: true,
    });
    if (payload.image && existingBanner.image) {
        yield (0, cloudinary_config_1.deleteImageFromCLoudinary)(existingBanner.image);
    }
    return updatedBanner;
});
const deleteBanner = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const banner = yield banner_model_1.Banner.findById(id);
    if (!banner) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Banner not found");
    }
    yield (0, cloudinary_config_1.deleteImageFromCLoudinary)(banner.image);
    return yield banner_model_1.Banner.findByIdAndDelete(id);
});
exports.BannerServices = {
    createBanner,
    getAllBanners,
    getActiveBanners,
    getBannerById,
    updateBanner,
    deleteBanner,
};
