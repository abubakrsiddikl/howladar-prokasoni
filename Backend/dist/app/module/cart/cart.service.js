"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartServices = void 0;
const mongoose_1 = require("mongoose");
const book_model_1 = require("../book/book.model");
const AppError_1 = __importDefault(require("../../errorHelper/AppError"));
const cart_model_1 = require("./cart.model");
const addToCart = (userId, bookId, quantity) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield (0, mongoose_1.startSession)();
    session.startTransaction();
    try {
        const book = yield book_model_1.Book.findById(bookId).session(session);
        if (!book)
            throw new AppError_1.default(404, "Book not found");
        if (!book.available || book.stock < quantity) {
            throw new AppError_1.default(400, "এই পরিমাণ বই স্টকে নেই।");
        }
        const existing = yield cart_model_1.Cart.findOne({ user: userId, book: bookId }).session(session);
        if (existing) {
            const newQuantity = existing.quantity + quantity;
            if (newQuantity > book.stock) {
                throw new AppError_1.default(400, "Stock limit exceeded");
            }
            existing.quantity = newQuantity;
            yield existing.save({ session });
        }
        else {
            yield cart_model_1.Cart.create([{ user: userId, book: bookId, quantity }], {
                session,
            });
        }
        yield session.commitTransaction();
        return yield getMyCart(userId);
    }
    catch (error) {
        yield session.abortTransaction();
        throw error;
    }
    finally {
        session.endSession();
    }
});
const getMyCart = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield cart_model_1.Cart.find({ user: userId }).populate("book");
});
const removeFromCart = (userId, cartItemId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield cart_model_1.Cart.findOneAndDelete({ _id: cartItemId, user: userId });
});
const updateCartQuantity = (userId, cartItemId, quantity) => __awaiter(void 0, void 0, void 0, function* () {
    const cartItem = yield cart_model_1.Cart.findOne({ _id: cartItemId, user: userId });
    if (!cartItem)
        throw new AppError_1.default(404, "Cart item not found");
    const book = yield book_model_1.Book.findById(cartItem.book);
    if (!book)
        throw new AppError_1.default(404, "Book not found");
    if (quantity > book.stock)
        throw new AppError_1.default(400, "Stock limit exceeded");
    cartItem.quantity = quantity;
    return yield cartItem.save();
});
const clearCart = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield cart_model_1.Cart.deleteMany({ user: userId });
});
const mergeCart = (userId, items) => __awaiter(void 0, void 0, void 0, function* () {
    const ops = items.map((item) => ({
        updateOne: {
            filter: { user: userId, book: item.book },
            update: { $inc: { quantity: item.quantity } },
            upsert: true,
        },
    }));
    yield cart_model_1.Cart.bulkWrite(ops);
    return yield getMyCart(userId);
});
exports.CartServices = {
    addToCart,
    getMyCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    mergeCart,
};
