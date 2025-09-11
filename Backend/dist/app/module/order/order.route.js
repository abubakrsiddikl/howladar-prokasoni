"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRoutes = void 0;
const express_1 = require("express");
const order_controller_1 = require("./order.controller");
const checkAuth_1 = require("../../middleware/checkAuth");
const user_interface_1 = require("../user/user.interface");
const validateRequest_1 = require("../../middleware/validateRequest");
const order_validation_1 = require("./order.validation");
const router = (0, express_1.Router)();
//  Create Order (customer only)
router.post("/create", (0, validateRequest_1.validateRequest)(order_validation_1.createOrderSchema), (0, checkAuth_1.checkAuth)(user_interface_1.Role.CUSTOMER), order_controller_1.OrderController.createOrder);
// Get my order
router.get("/my-order", (0, checkAuth_1.checkAuth)(user_interface_1.Role.CUSTOMER), order_controller_1.OrderController.getMyOrders);
//  Get all orders (admin & store manager)
router.get("/all-order", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.STORE_MANAGER), order_controller_1.OrderController.getAllOrders);
// Get single order (admin, store manager, or the customer who ordered it)
router.get("/:orderId", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.STORE_MANAGER, user_interface_1.Role.CUSTOMER), order_controller_1.OrderController.getSingleOrder);
// trace order publicly
router.get("/:orderId/trace", order_controller_1.OrderController.getTraceOrder);
//  Update order status (admin & store manager)
router.patch("/:id/status", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.STORE_MANAGER), (0, validateRequest_1.validateRequest)(order_validation_1.updateOrderStatusZodSchema), order_controller_1.OrderController.updateOrderStatus);
// update payment status (admin & store manager)
router.patch("/:orderId/payment-status", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.STORE_MANAGER), (0, validateRequest_1.validateRequest)(order_validation_1.updatePaymentStatusZodSchema), order_controller_1.OrderController.updatePaymentStatus);
exports.OrderRoutes = router;
