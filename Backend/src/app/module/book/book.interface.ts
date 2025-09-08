import { Types } from "mongoose";

export interface IBook {
  title: string;
  slug: string;
  author: string;
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
}

export interface IBookFilterOptions {
  search?: string;
  genre?: string;
  page?: number;
  limit?: number;
}
