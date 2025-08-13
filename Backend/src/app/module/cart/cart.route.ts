import express from "express";
import { CartControllers } from "./cart.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { addToCartZodSchema } from "./cart.validation";

const router = express.Router();

// Add to cart
router.post(
  "/add",
  checkAuth(),
  validateRequest(addToCartZodSchema),
  CartControllers.addToCart
);

// Get my cart
router.get("/my-cart", checkAuth(), CartControllers.getMyCart);

// Remove from cart
router.delete("/remove/:id", checkAuth(), CartControllers.removeFromCart);

// Update cart quantity
router.patch("/update/:id", checkAuth(), CartControllers.updateCartQuantity);

// Clear cart
router.delete("/clear", checkAuth(), CartControllers.clearCart);

// Merge cart
router.post("/merge", checkAuth(), CartControllers.mergeCart);

export const CartRoutes = router;
