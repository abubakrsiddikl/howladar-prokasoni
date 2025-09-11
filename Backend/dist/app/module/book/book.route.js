"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookRoutes = void 0;
const express_1 = require("express");
const validateRequest_1 = require("../../middleware/validateRequest");
const book_validation_1 = require("./book.validation");
const checkAuth_1 = require("../../middleware/checkAuth");
const user_interface_1 = require("../user/user.interface");
const book_controller_1 = require("./book.controller");
const multer_config_1 = require("../../config/multer.config");
const router = (0, express_1.Router)();
// create a book
router.post("/create", multer_config_1.multerUpload.fields([
    { name: "file", maxCount: 1 },
    { name: "files", maxCount: 5 },
]), (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.STORE_MANAGER), (0, validateRequest_1.validateRequest)(book_validation_1.createBookZodSchema), book_controller_1.BookControllers.createBook);
// get all books
router.get("/all-books", book_controller_1.BookControllers.getAllBook);
// get single book with slug
router.get("/:slug", book_controller_1.BookControllers.getSingleBook);
// get book by  genre
router.get("/genre/:genre", book_controller_1.BookControllers.getBookByGenre);
// update a book
router.patch("/:id", multer_config_1.multerUpload.fields([
    { name: "file", maxCount: 1 },
    { name: "files", maxCount: 5 },
]), (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.STORE_MANAGER), 
// validateRequest(updateBookZodSchema),
book_controller_1.BookControllers.updateBook);
// delete a book
router.delete("/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.STORE_MANAGER), book_controller_1.BookControllers.deleteBook);
exports.BookRoutes = router;
