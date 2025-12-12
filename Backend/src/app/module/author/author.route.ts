import { Router } from "express";
import { AuthorControllers } from "./author.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middleware/validateRequest";
import { createAuthorZodSchema, updateAuthorZodSchema } from "./author.validation";
import { multerUpload } from "../../config/multer.config";

const router = Router();

// Create a new author (Admin/Store Manager only)
router.post(
  "/create",
  multerUpload.fields([{ name: "file", maxCount: 1 }]), // Single image for profile
  checkAuth(Role.ADMIN, Role.STORE_MANAGER),
  validateRequest(createAuthorZodSchema),
  AuthorControllers.createAuthor
);

// Get all authors (Public)
router.get("/", AuthorControllers.getAllAuthors);

// Get single author by ID (Public)
router.get("/:slug", AuthorControllers.getSingleAuthor);

// Update an author by ID (Admin/Store Manager only)
router.patch(
  "/update/:id",
  multerUpload.fields([{ name: "file", maxCount: 1 }]),
  checkAuth(Role.ADMIN, Role.STORE_MANAGER),
  validateRequest(updateAuthorZodSchema),
  AuthorControllers.updateAuthor
);

// Delete an author (soft delete) (Admin/Store Manager only)
router.delete(
  "/delete/:id",
  checkAuth(Role.ADMIN, Role.STORE_MANAGER),
  AuthorControllers.deleteAuthor
);

export const AuthorRoutes = router;