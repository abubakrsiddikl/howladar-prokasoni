import { z } from "zod";

// Zod schema for creating a new author
export const createAuthorZodSchema = z.object({
  name: z.string().min(1, "Author Name is required"),
  bio: z.string().optional(),
  birthDate: z.string().optional(),
  profileImage: z.string().optional(),
});

// Zod schema for updating an existing author
export const updateAuthorZodSchema = z.object({
  name: z.string().optional(),
  bio: z.string().optional(),
  birthDate: z.string().optional(),
  profileImage: z.string().optional(),
});
