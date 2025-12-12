import express from "express";
import { GenreController } from "./genre.controller";
import {
  createGenreValidationSchema,
  updateGenreValidationSchema,
} from "./genre.validation";
import { validateRequest } from "../../middleware/validateRequest";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../user/user.interface";

const router = express.Router();

// Create Genre
router.post(
  "/create",
  checkAuth(Role.ADMIN, Role.STORE_MANAGER),
  validateRequest(createGenreValidationSchema),
  GenreController.createGenre
);

//  Get All Genres
router.get("/", GenreController.getAllGenres);

// get genre sorted by book count
router.get("/sorted", GenreController.getSortedGenresByBookCount);

// Get Single Genre by Slug
router.get("/:slug", GenreController.getGenreBySlug);

//  Update Genre
router.patch(
  "/:slug",
  checkAuth(Role.ADMIN, Role.STORE_MANAGER),
  validateRequest(updateGenreValidationSchema),
  GenreController.updateGenre
);

//  Delete Genre
router.delete(
  "/:id",
  checkAuth(Role.ADMIN, Role.STORE_MANAGER),
  GenreController.deleteGenre
);

export const GenreRoutes = router;
