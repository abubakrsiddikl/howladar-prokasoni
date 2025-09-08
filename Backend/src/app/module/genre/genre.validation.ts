import { z } from "zod";

export const createGenreValidationSchema = z.object({
  name: z.string().min(2,"Name is required").max(50),
  description: z.string().optional(),
});

export const updateGenreValidationSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  description: z.string().optional(),
});
