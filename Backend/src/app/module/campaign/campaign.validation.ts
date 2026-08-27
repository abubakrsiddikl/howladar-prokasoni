import { z } from "zod";

export const createCampaignZodSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters long")
    .max(150, "Title cannot exceed 150 characters"),

  description: z
    .string()
    .trim()
    .min(5, "Description must be at least 5 characters long")
    .max(2000, "Description cannot exceed 2000 characters"),

  campaignPrice: z.number().nonnegative("Campaign price cannot be negative"),

  // deliveryCharge: z
  //   .number()
  //   .nonnegative("Delivery charge cannot be negative")
  //   .default(60),

  isActive: z.boolean().default(true),
});

export const updateCampaignValidationSchema = createCampaignZodSchema.partial();

export const updateCampaignStatusValidationSchema = z.object({
  isActive: z.boolean(),
});

