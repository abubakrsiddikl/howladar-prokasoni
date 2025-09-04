import { z } from "zod";

export const shippingSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email"),
  phone: z.string().min(10, "Phone number is required"),
  division: z.string().min(1, "Division is required"),
  district: z.string().min(1, "District is required"),
  city: z.string().min(1, "City is required"),
  address: z.string().min(5, "Address is required"),
});

export type ShippingFormType = z.infer<typeof shippingSchema>;
