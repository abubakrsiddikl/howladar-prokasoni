"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartRoutes = void 0;
const express_1 = __importDefault(require("express"));
const cart_controller_1 = require("./cart.controller");
const checkAuth_1 = require("../../middleware/checkAuth");
const validateRequest_1 = require("../../middleware/validateRequest");
const cart_validation_1 = require("./cart.validation");
const router = express_1.default.Router();
// Add to cart
router.post("/add", (0, checkAuth_1.checkAuth)(), (0, validateRequest_1.validateRequest)(cart_validation_1.addToCartZodSchema), cart_controller_1.CartControllers.addToCart);
// Get my cart
router.get("/my-cart", (0, checkAuth_1.checkAuth)(), cart_controller_1.CartControllers.getMyCart);
// Remove from cart
router.delete("/remove/:id", (0, checkAuth_1.checkAuth)(), cart_controller_1.CartControllers.removeFromCart);
// Update cart quantity
router.patch("/update/:id", (0, checkAuth_1.checkAuth)(), cart_controller_1.CartControllers.updateCartQuantity);
// Clear cart
router.delete("/clear", (0, checkAuth_1.checkAuth)(), cart_controller_1.CartControllers.clearCart);
// Merge cart
router.post("/merge", (0, checkAuth_1.checkAuth)(), cart_controller_1.CartControllers.mergeCart);
exports.CartRoutes = router;
