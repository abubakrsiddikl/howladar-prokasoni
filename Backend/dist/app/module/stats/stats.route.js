"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatsRoutes = void 0;
const express_1 = __importDefault(require("express"));
const checkAuth_1 = require("../../middleware/checkAuth");
const user_interface_1 = require("../user/user.interface");
const stats_controller_1 = require("./stats.controller");
const router = express_1.default.Router();
router.get("/customer", (0, checkAuth_1.checkAuth)(user_interface_1.Role.CUSTOMER), stats_controller_1.StatsControllers.getCustomerDashboardStats);
router.get("/", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.STORE_MANAGER), stats_controller_1.StatsControllers.getStats);
router.get("/monthly-sales", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.STORE_MANAGER), stats_controller_1.StatsControllers.getMonthlySalesStatsController);
exports.StatsRoutes = router;
