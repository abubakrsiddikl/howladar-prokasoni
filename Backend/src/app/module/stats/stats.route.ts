import express from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../user/user.interface";
import { StatsControllers } from "./stats.controller";

const router = express.Router();

router.get("/customer", checkAuth(Role.CUSTOMER), StatsControllers.getCustomerDashboardStats);

router.get(
  "/",
  checkAuth(Role.ADMIN, Role.STORE_MANAGER),
  StatsControllers.getStats
);
router.get(
  "/monthly-sales",
  checkAuth(Role.ADMIN, Role.STORE_MANAGER),
  StatsControllers.getMonthlySalesStatsController
);

export const StatsRoutes = router;
