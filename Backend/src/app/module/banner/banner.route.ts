import { Router } from "express";


const router = Router();

router.post("/create", BannerController.createBanner);
router.get("/all", BannerController.getBanners);

export const BannerRoutes = router;
