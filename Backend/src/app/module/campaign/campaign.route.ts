import { Router } from "express";
import { CampaignControllers } from "./campaign.controller";
// import { validateRequest } from "../../middlewares/validateRequest";
// import { CampaignValidations } from "./campaign.validation";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../user/user.interface";
import { multerUpload } from "../../config/multer.config";
import { validateRequest } from "../../middleware/validateRequest";
import {
  createCampaignZodSchema,
  updateCampaignValidationSchema,
} from "./campaign.validation";

const router = Router();

router.get("/active", CampaignControllers.getActiveCampaigns);

router.get("/:slug", CampaignControllers.getCampaignBySlug);

router.post(
  "/",
  multerUpload.single("file"),
  checkAuth(Role.ADMIN, Role.STORE_MANAGER),
  validateRequest(createCampaignZodSchema),
  CampaignControllers.createCampaign,
);

router.patch(
  "/update/:id",
  multerUpload.single("file"),
  checkAuth(Role.ADMIN, Role.STORE_MANAGER),
  validateRequest(updateCampaignValidationSchema),
  CampaignControllers.updateCampaign,
);

router.delete(
  "/delete/:id",
  checkAuth(Role.ADMIN, Role.STORE_MANAGER),
  CampaignControllers.deleteCampaign,
);

router.get("/", checkAuth(Role.ADMIN), CampaignControllers.getAllCampaigns);

export const CampaignRoutes = router;
