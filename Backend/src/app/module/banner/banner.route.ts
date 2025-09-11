import { Router } from "express";
import { BannerControllers } from "./banner.controller";
import { multerUpload } from "../../config/multer.config";
import { validateRequest } from "../../middleware/validateRequest";

import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../user/user.interface";
import {
  bannerCreateZodSchema,
  bannerUpdateZodSchema,
} from "./banner.validation";

const router = Router();

// create
router.post(
  "/create",
  multerUpload.single("file"),
  checkAuth(Role.ADMIN, Role.STORE_MANAGER),
  validateRequest(bannerCreateZodSchema),
  BannerControllers.createBanner
);

// banner
router.get("/all-banners", BannerControllers.getAllBanners);

// active
router.get("/active-banners", BannerControllers.getActiveBanners);

// update
router.patch(
  "/update/:id",
  multerUpload.single("file"),
  checkAuth(Role.ADMIN, Role.STORE_MANAGER),
  validateRequest(bannerUpdateZodSchema),
  BannerControllers.updateBanner
);

// banner delete
router.delete(
  "/delete/:id",
  checkAuth(Role.ADMIN, Role.STORE_MANAGER),
  BannerControllers.deleteBanner
);

export const BannerRoutes = router;
