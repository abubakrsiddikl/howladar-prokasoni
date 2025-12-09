import { Types } from "mongoose";

export interface IBook {
  title: string;
  slug: string;
  author: Types.ObjectId;
  price: number;
  stock: number;
  genre: Types.ObjectId;
  discount?: number;
  discountedPrice?: number;
  description?: string;
  coverImage: string;
  previewImages?: string[];
  available: boolean;
  deletePreviewImages?: string[];
  publisher: string;
  updatedAt?: Date;
}

export interface IBookFilterOptions {
  search?: string;
  genre?: string;
  page?: number;
  limit?: number;
}
