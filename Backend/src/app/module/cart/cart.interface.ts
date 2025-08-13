import { Types } from "mongoose";

export interface ICartItem {
  _id?: Types.ObjectId;
  user: Types.ObjectId;
  book: Types.ObjectId;
  quantity: number;
}