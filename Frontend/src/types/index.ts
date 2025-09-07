import type { ComponentType } from "react";

export  { type IBook,type IBookCreate, Genre } from "./book.type";
export type { CartItem, ICartItem } from "./cart.type";
export type { TRole } from "./auth.type";
export type { IOrder, ICreateOrderPayload, IPaymentMethod } from "./order.type";

export interface IResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}

export interface ISidebarItem {
  title: string;
  items: {
    title: string;
    url: string;
    component: ComponentType;
  }[];
}
