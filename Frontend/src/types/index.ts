export type { IBook } from "./book.type";
export type { CartItem, ICartItemResponse } from "./cart.type";
export type { TRole } from "./auth.type";
export type { IOrder } from "./order.type";

export interface IResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}
