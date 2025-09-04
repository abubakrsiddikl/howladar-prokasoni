import express from "express";
import { CartControllers } from "./cart.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { addToCartZodSchema } from "./cart.validation";
import { Role } from "../user/user.interface";

const router = express.Router();

// Add to cart
router.post(
  "/add",
  checkAuth(...Object.values(Role)),
  validateRequest(addToCartZodSchema),
  CartControllers.addToCart
);

// Get my cart
router.get(
  "/my-cart",
  checkAuth(...Object.values(Role)),
  CartControllers.getMyCart
);

// Remove from cart
router.delete(
  "/remove/:id",
  checkAuth(...Object.values(Role)),
  CartControllers.removeFromCart
);

// Update cart quantity
router.patch(
  "/update/:id",
  checkAuth(...Object.values(Role)),
  CartControllers.updateCartQuantity
);

// Clear cart
router.delete(
  "/clear",
  checkAuth(...Object.values(Role)),
  CartControllers.clearCart
);

// Merge cart
router.post(
  "/merge",
  checkAuth(...Object.values(Role)),
  CartControllers.mergeCart
);

export const CartRoutes = router;
