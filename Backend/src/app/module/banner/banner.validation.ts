import { z } from "zod";

export const bannerCreateZodSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  image: z.string().url("Image must be a valid URL").optional(),
  link: z.string().url().optional(),
  active: z.boolean(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export const bannerUpdateZodSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").optional(),
  image: z.string().url("Image must be a valid URL").optional(),
  link: z.string().url().optional(),
  active: z.boolean(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});