import type { ComponentType } from "react";

export { type IBook, type IBookCreate, Genre } from "./book.type";
export type { CartItem, ICartItem } from "./cart.type";
export type { TRole, IUser } from "./auth.type";
export type {
  IOrder,
  ICreateOrderPayload,
  IPaymentMethod,
  IOrderStatusLog,
} from "./order.type";
export type { IGenre } from "./genre.type";

export type { IBanner, IBannerCreatePayload,IBannerUpdatePayload } from "./banner.type";

export interface TMeta {
  total: number;
  totalPage: number;
}

export interface IResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
  meta?: TMeta;
}

export interface ISidebarItem {
  title: string;
  items: {
    title: string;
    url: string;
    component: ComponentType;
  }[];
}

type ZodIssue = {
  code: string;
  expected: string;
  received: string;
  path: string[];
  message: string;
};

type ErrorSource = {
  path: string;
  message: string;
};

export interface IErrorResponse {
  success: boolean;
  message: string;
  errorSources?: ErrorSource[];
  err?: {
    issues: ZodIssue[];
    name: string;
  };
  stack?: string;
}
