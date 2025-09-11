import { Router } from "express";
import { validateRequest } from "../../middleware/validateRequest";
import { createBookZodSchema } from "./book.validation";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../user/user.interface";
import { BookControllers } from "./book.controller";
import { multerUpload } from "../../config/multer.config";

const router = Router();
// create a book
router.post(
  "/create",
  multerUpload.fields([
    { name: "file", maxCount: 1 },
    { name: "files", maxCount: 10 },
  ]),
  checkAuth(Role.ADMIN, Role.STORE_MANAGER),
  validateRequest(createBookZodSchema),
  BookControllers.createBook
);

// get all books
router.get("/all-books", BookControllers.getAllBook);
// get single book with slug
router.get("/:slug", BookControllers.getSingleBook);
// get book by  genre
router.get("/genre/:genre", BookControllers.getBookByGenre);
// update a book
router.patch(
  "/:id",
  multerUpload.fields([
    { name: "file", maxCount: 1 },
    { name: "files", maxCount: 5 },
  ]),
  checkAuth(Role.ADMIN, Role.STORE_MANAGER),
  // validateRequest(updateBookZodSchema),
  BookControllers.updateBook
);
// delete a book
router.delete(
  "/:id",
  checkAuth(Role.ADMIN, Role.STORE_MANAGER),
  BookControllers.deleteBook
);

export const BookRoutes = router;
