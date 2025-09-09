import { Router } from "express";
import { OrderController } from "./order.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middleware/validateRequest";
import {
  createOrderSchema,
  updateOrderStatusZodSchema,
  updatePaymentStatusZodSchema,
} from "./order.validation";

const router = Router();

//  Create Order (customer only)
router.post(
  "/create",
  validateRequest(createOrderSchema),
  checkAuth(Role.CUSTOMER),
  OrderController.createOrder
);

// Get my order
router.get("/my-order", checkAuth(Role.CUSTOMER), OrderController.getMyOrders);

//  Get all orders (admin & store manager)
router.get(
  "/all-order",
  checkAuth(Role.ADMIN, Role.STORE_MANAGER),
  OrderController.getAllOrders
);

// Get single order (admin, store manager, or the customer who ordered it)
router.get(
  "/:orderId",
  checkAuth(Role.ADMIN, Role.STORE_MANAGER, Role.CUSTOMER),
  OrderController.getSingleOrder
);

// trace order publicly
router.get("/:orderId/trace", OrderController.getTraceOrder);

//  Update order status (admin & store manager)
router.patch(
  "/:id/status",
  checkAuth(Role.ADMIN, Role.STORE_MANAGER),
  validateRequest(updateOrderStatusZodSchema),
  OrderController.updateOrderStatus
);
// update payment status (admin & store manager)
router.patch(
  "/:orderId/payment-status",
  checkAuth(Role.ADMIN, Role.STORE_MANAGER),
  validateRequest(updatePaymentStatusZodSchema),
  OrderController.updatePaymentStatus
);

export const OrderRoutes = router;
