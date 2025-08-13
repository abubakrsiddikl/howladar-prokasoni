import { z } from "zod";

export const addToCartZodSchema = z.object({
  body: z.object({
    book: z.string({ required_error: "Book ID is required" }),
    quantity: z
      .number({ required_error: "Quantity is required" })
      .min(1, "Quantity must be at least 1"),
  }),
});
