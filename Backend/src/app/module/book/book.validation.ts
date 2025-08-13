import { z } from "zod";
import { Genre } from "./book.interface";

export const createBookZodSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  price: z.number().min(0, "Price must be a positive number"),
  stock: z.number().int().min(0, "Stock must be a non-negative integer"),
  genre: z.nativeEnum(Genre),
  discount: z.number().min(0).max(100, "Discount must be between 0 and 100"),
  description: z.string().max(2000).optional(),
  coverImage: z.string().url("Cover image must be a valid URL"),
  previewImages: z
    .array(z.string().url("Preview images must be valid URLs"))
    .optional(),
  available: z.boolean(),
});

export const updateBookZodSchema = createBookZodSchema.partial();

export const filterBookZodSchema = z.object({
  search: z.string().optional(),
  genre: z.nativeEnum(Genre).optional(),
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().optional(),
});
