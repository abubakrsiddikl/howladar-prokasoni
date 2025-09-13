"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BannerRoutes = void 0;
const express_1 = require("express");
const banner_controller_1 = require("./banner.controller");
const multer_config_1 = require("../../config/multer.config");
const validateRequest_1 = require("../../middleware/validateRequest");
const checkAuth_1 = require("../../middleware/checkAuth");
const user_interface_1 = require("../user/user.interface");
const banner_validation_1 = require("./banner.validation");
const router = (0, express_1.Router)();
// create
router.post("/create", multer_config_1.multerUpload.single("file"), (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.STORE_MANAGER), (0, validateRequest_1.validateRequest)(banner_validation_1.bannerCreateZodSchema), banner_controller_1.BannerControllers.createBanner);
// banner
router.get("/all-banners", banner_controller_1.BannerControllers.getAllBanners);
// active
router.get("/active-banners", banner_controller_1.BannerControllers.getActiveBanners);
// single
router.get("/:id", banner_controller_1.BannerControllers.getSingleBanner);
// update
router.patch("/update/:id", multer_config_1.multerUpload.single("file"), (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.STORE_MANAGER), (0, validateRequest_1.validateRequest)(banner_validation_1.bannerUpdateZodSchema), banner_controller_1.BannerControllers.updateBanner);
// banner delete
router.delete("/delete/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.STORE_MANAGER), banner_controller_1.BannerControllers.deleteBanner);
exports.BannerRoutes = router;
