import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { CartServices } from "./cart.service";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";

const addToCart = catchAsync(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req.user as JwtPayload).userId;
    const { bookId, quantity } = req.body;

    const cartItem = await CartServices.addToCart(userId, bookId, quantity);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Book added to cart successfully",
      data: cartItem,
    });
  }
);

const getMyCart = catchAsync(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req.user as JwtPayload).userId;
    const cartItems = await CartServices.getMyCart(userId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Cart retrieved successfully",
      data: cartItems,
    });
  }
);
const removeFromCart = catchAsync(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req.user as JwtPayload).userId;
    const cartItemId = req.params.id;

    await CartServices.removeFromCart(userId, cartItemId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Cart item removed successfully",
      data: null,
    });
  }
);
const updateCartQuantity = catchAsync(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req.user as JwtPayload).userId;
    const cartItemId = req.params.id;
    const { quantity } = req.body;
    console.log(req.body,cartItemId)
    const updatedCartItem = await CartServices.updateCartQuantity(
      userId,
      cartItemId,
      quantity
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Cart item updated successfully",
      data: updatedCartItem,
    });
  }
);

const clearCart = catchAsync(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req.user as JwtPayload).userId;

    await CartServices.clearCart(userId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Cart cleared successfully",
      data: null,
    });
  }
);
const mergeCart = catchAsync(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req.user as JwtPayload).userId;
    const items = req.body.items;

    const mergedCart = await CartServices.mergeCart(userId, items);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Cart merged successfully",
      data: mergedCart,
    });
  }
);
export const CartControllers = {
  addToCart,
  getMyCart,
  removeFromCart,
  updateCartQuantity,
  clearCart,
  mergeCart,
};
