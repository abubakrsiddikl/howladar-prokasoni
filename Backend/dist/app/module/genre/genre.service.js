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
const QueryBuilder_1 = require("../../utils/QueryBuilder");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const mongoose_1 = __importDefault(require("mongoose"));
const book_model_1 = require("../book/book.model");
const cloudinary_config_1 = require("../../config/cloudinary.config");
const order_model_1 = require("../order/order.model");
const cart_model_1 = require("../cart/cart.model");
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
const getAllGenres = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryBuilder = new QueryBuilder_1.QueryBuilder(genre_model_1.Genre.find(), query);
    yield queryBuilder.filter();
    queryBuilder.search(["name"]).sort().paginate();
    const [data, meta] = yield Promise.all([
        queryBuilder.build(),
        queryBuilder.getMeta(),
    ]);
    return { data, meta };
});
// get sorted genre by book
const getSortedGenresByBookCount = () => __awaiter(void 0, void 0, void 0, function* () {
    const sortedGenres = yield genre_model_1.Genre.aggregate([
        // 1. জেনরগুলোকে তাদের বইয়ের সাথে যুক্ত করা
        {
            $lookup: {
                from: "books", // বই কালেকশনের নাম (ছোট হাতের এবং plural)
                localField: "_id",
                foreignField: "genre",
                as: "books",
            },
        },
        // 2. বইয়ের সংখ্যা (count) গণনা করা
        {
            $addFields: {
                bookCount: { $size: "$books" },
            },
        },
        // 3. বইয়ের সংখ্যা অনুসারে ডিসেন্ডিং অর্ডারে সাজানো
        {
            $sort: { bookCount: -1 },
        },
        // 4. যে জেনরগুলোর বই নেই (bookCount: 0) সেগুলোকে ফিল্টার করে বাদ দেওয়া
        {
            $match: {
                bookCount: { $gt: 0 }, // 0 এর বেশি বই আছে এমন জেনরগুলো রাখো
            },
        },
        // 5. অপ্রয়োজনীয় 'books' অ্যারে বাদ দেওয়া
        {
            $project: {
                books: 0,
            },
        },
    ]);
    return sortedGenres;
});
// Get Single Genre by slug
const getGenreBySlug = (slug) => __awaiter(void 0, void 0, void 0, function* () {
    return yield genre_model_1.Genre.findOne({ slug });
});
// Update Genre
const updateGenre = (slug, payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (payload.name) {
        const existingGenre = yield genre_model_1.Genre.findOne({
            name: payload.name,
            slug: { $ne: slug },
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
    var _a;
    const isGenreExist = yield genre_model_1.Genre.findById(id);
    if (!isGenreExist) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Genre not found");
    }
    // 2. start session
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        // 3. find genre reference book
        const booksToDelete = yield book_model_1.Book.find({ genre: id }).session(session);
        // 4. start book delete
        if (booksToDelete.length > 0) {
            for (const book of booksToDelete) {
                // A. delete cloudinary image
                (0, cloudinary_config_1.deleteImageFromCLoudinary)(book.coverImage);
                (_a = book.previewImages) === null || _a === void 0 ? void 0 : _a.map((img) => (0, cloudinary_config_1.deleteImageFromCLoudinary)(img));
                // B. OrderItems to delete book reference
                yield order_model_1.Order.updateMany({}, {
                    $pull: {
                        items: { book: book._id },
                    },
                }, { session } // pass transaction
                );
                // C. CartItems to delete book reference
                yield cart_model_1.Cart.deleteMany({ book: book._id }, { session });
                // D. Finally delete book
                yield book_model_1.Book.findByIdAndDelete(book._id, { session });
            }
        }
        // 5. after all book delete then genre delete
        const deletedGenre = yield genre_model_1.Genre.findByIdAndDelete(id, { session });
        if (!deletedGenre) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Failed to delete genre");
        }
        // 6. if success all operation commit session
        yield session.commitTransaction();
        session.endSession();
        return deletedGenre;
    }
    catch (error) {
        // if error to roll back
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
exports.GenreService = {
    createGenre,
    getAllGenres,
    getSortedGenresByBookCount,
    getGenreBySlug,
    updateGenre,
    deleteGenre,
};
