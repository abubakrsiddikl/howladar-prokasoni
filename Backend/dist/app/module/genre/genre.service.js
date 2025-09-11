"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenreService = void 0;
const genre_model_1 = require("./genre.model");
const AppError_1 = __importDefault(require("../../errorHelper/AppError"));
// Create Genre
const createGenre = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existingGenre = yield genre_model_1.Genre.findOne({ name: payload.name });
    if (existingGenre) {
        throw new AppError_1.default(401, `${existingGenre.name} This genre already added to db `);
    }
    const genre = new genre_model_1.Genre(payload);
    return yield genre.save();
});
// Get All Genres
const getAllGenres = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield genre_model_1.Genre.find();
});
// Get Single Genre by slug
const getGenreBySlug = (slug) => __awaiter(void 0, void 0, void 0, function* () {
    return yield genre_model_1.Genre.findOne({ slug });
});
// Update Genre
const updateGenre = (slug, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // যদি payload এ name থাকে তাহলে check করতে হবে
    if (payload.name) {
        const existingGenre = yield genre_model_1.Genre.findOne({
            name: payload.name,
            slug: { $ne: slug }, // এই slug বাদ দিয়ে check করা
        });
        if (existingGenre) {
            throw new AppError_1.default(400, `${payload.name} already exists. Please choose a different name.`);
        }
    }
    // update করে নতুন document return করবো
    const updatedGenre = yield genre_model_1.Genre.findOneAndUpdate({ slug }, payload, {
        new: true,
        runValidators: true,
    });
    if (!updatedGenre) {
        throw new AppError_1.default(404, "Genre not found");
    }
    return updatedGenre;
});
// Delete Genre
const deleteGenre = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield genre_model_1.Genre.findByIdAndDelete(id);
});
exports.GenreService = {
    createGenre,
    getAllGenres,
    getGenreBySlug,
    updateGenre,
    deleteGenre,
};
