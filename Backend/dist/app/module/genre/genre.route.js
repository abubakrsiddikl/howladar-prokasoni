"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenreRoutes = void 0;
const express_1 = __importDefault(require("express"));
const genre_controller_1 = require("./genre.controller");
const genre_validation_1 = require("./genre.validation");
const validateRequest_1 = require("../../middleware/validateRequest");
const checkAuth_1 = require("../../middleware/checkAuth");
const user_interface_1 = require("../user/user.interface");
const router = express_1.default.Router();
// Create Genre
router.post("/create", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.STORE_MANAGER), (0, validateRequest_1.validateRequest)(genre_validation_1.createGenreValidationSchema), genre_controller_1.GenreController.createGenre);
//  Get All Genres
router.get("/", genre_controller_1.GenreController.getAllGenres);
// get genre sorted by book count
router.get("/sorted", genre_controller_1.GenreController.getSortedGenresByBookCount);
// Get Single Genre by Slug
router.get("/:slug", genre_controller_1.GenreController.getGenreBySlug);
//  Update Genre
router.patch("/:slug", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.STORE_MANAGER), (0, validateRequest_1.validateRequest)(genre_validation_1.updateGenreValidationSchema), genre_controller_1.GenreController.updateGenre);
//  Delete Genre
router.delete("/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.STORE_MANAGER), genre_controller_1.GenreController.deleteGenre);
exports.GenreRoutes = router;
