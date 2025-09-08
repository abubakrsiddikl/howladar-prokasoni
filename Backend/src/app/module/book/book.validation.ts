import { z } from "zod";

export const createBookZodSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  price: z.number().min(0, "Price must be positive"),
  stock: z.number().int().min(0, "Stock must be non-negative"),
  genre: z.string().min(1, "Genre is required"), 
  discount: z.number().min(0).max(100).optional(),
  discountedPrice: z.number().min(0).optional(),
  description: z.string().max(2000).optional(),
  coverImage: z.string().url().optional(),
  previewImages: z.array(z.string().url()).optional(),
  available: z.boolean().optional(),
  publisher: z.string().optional(), // new field
});

export const updateBookZodSchema = createBookZodSchema.partial().extend({
  deletePreviewImages: z.array(z.string()).optional(),
});

export const filterBookZodSchema = z.object({
  search: z.string().optional(),
  genre: z.string().optional(), // filter by genre id or name
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().optional(),
});
