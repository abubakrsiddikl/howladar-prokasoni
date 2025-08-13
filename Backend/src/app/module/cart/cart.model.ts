import { Schema, model } from "mongoose";
import { ICartItem } from "./cart.interface";

const cartSchema = new Schema<ICartItem>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    book: { type: Schema.Types.ObjectId, ref: "Book", required: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  { timestamps: true }
);

cartSchema.index({ user: 1, book: 1 }, { unique: true });

export const Cart = model<ICartItem>("Cart", cartSchema);
