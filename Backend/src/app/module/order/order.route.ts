import { Router } from "express";
import { OrderController } from "./order.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middleware/validateRequest";
import { createOrderSchema } from "./order.validation";

const router = Router();

//  Create Order (customer only)
router.post("/create",validateRequest(createOrderSchema), checkAuth(Role.CUSTOMER), OrderController.createOrder);

//  Get all orders (admin & store manager)
router.get(
  "/",
  checkAuth(Role.ADMIN, Role.STORE_MANAGER),
  OrderController.getAllOrders
);

// Get single order (admin, store manager, or the customer who ordered it)
router.get(
  "/:orderId",
  checkAuth(Role.ADMIN, Role.STORE_MANAGER, Role.CUSTOMER),
  OrderController.getSingleOrder
);

//  Update order status (admin & store manager)
router.patch(
  "/:orderId/status",
  checkAuth(Role.ADMIN, Role.STORE_MANAGER),
  OrderController.updateOrderStatus
);

export const OrderRoutes = router;
