import { Router } from "express";
import { validateRequest } from "../../middleware/validateRequest";
import { createBookZodSchema, updateBookZodSchema } from "./book.validation";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../user/user.interface";
import { BookControllers } from "./book.controller";
import { multerUpload } from "../../config/multer.config";

const router = Router();
// create a book
router.post(
  "/create",
  validateRequest(createBookZodSchema),multerUpload.single("file"),
  checkAuth(Role.ADMIN, Role.STORE_MANAGER),
  BookControllers.createBook
);

// get all books
router.get("/all-books", BookControllers.getAllBook);
// get single book with slug
router.get("/:slug", BookControllers.getSingleBook);
// update a book
router.patch(
  "/:id",
  validateRequest(updateBookZodSchema),
  checkAuth(Role.ADMIN, Role.STORE_MANAGER),
  BookControllers.updateBook
);
// delete a book
router.delete(
  "/:id",
  checkAuth(Role.ADMIN, Role.STORE_MANAGER),
  BookControllers.deleteBook
);

export const BookRoutes = router;
