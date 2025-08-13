import { startSession } from "mongoose";
import { Book } from "../book/book.model";
import AppError from "../../errorHelper/AppError";
import { Cart } from "./cart.model";

const addToCart = async (userId: string, bookId: string, quantity: number) => {
  const session = await startSession();
  session.startTransaction();

  try {
    const book = await Book.findById(bookId).session(session);
    if (!book) throw new AppError(404, "Book not found");
    if (!book.available || book.stock < quantity) {
      throw new AppError(400, "এই পরিমাণ বই স্টকে নেই।");
    }

    const existing = await Cart.findOne({ user: userId, book: bookId }).session(
      session
    );

    if (existing) {
      const newQuantity = existing.quantity + quantity;
      if (newQuantity > book.stock) {
        throw new AppError(400, "Stock limit exceeded");
      }
      existing.quantity = newQuantity;
      await existing.save({ session });
    } else {
      await Cart.create([{ user: userId, book: bookId, quantity }], {
        session,
      });
    }

    await session.commitTransaction();
    return await getMyCart(userId);
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

const getMyCart = async (userId: string) => {
  return await Cart.find({ user: userId }).populate("book");
};

const removeFromCart = async (userId: string, cartItemId: string) => {
  return await Cart.findOneAndDelete({ _id: cartItemId, user: userId });
};

const updateCartQuantity = async (
  userId: string,
  cartItemId: string,
  quantity: number
) => {
  const cartItem = await Cart.findOne({ _id: cartItemId, user: userId });
  if (!cartItem) throw new AppError(404, "Cart item not found");

  const book = await Book.findById(cartItem.book);
  if (!book) throw new AppError(404, "Book not found");
  if (quantity > book.stock) throw new AppError(400, "Stock limit exceeded");

  cartItem.quantity = quantity;
  return await cartItem.save();
};

const clearCart = async (userId: string) => {
  return await Cart.deleteMany({ user: userId });
};

const mergeCart = async (
  userId: string,
  items: { book: string; quantity: number }[]
) => {
  const ops = items.map((item) => ({
    updateOne: {
      filter: { user: userId, book: item.book },
      update: { $inc: { quantity: item.quantity } },
      upsert: true,
    },
  }));
  await Cart.bulkWrite(ops);
  return await getMyCart(userId);
};

export const CartServices = {
  addToCart,
  getMyCart,
  removeFromCart,
  updateCartQuantity,
  clearCart,
  mergeCart,
};
