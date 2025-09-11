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
exports.BookServices = void 0;
const AppError_1 = __importDefault(require("../../errorHelper/AppError"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const book_model_1 = require("./book.model");
const book_constants_1 = require("./book.constants");
const QueryBuilder_1 = require("../../utils/QueryBuilder");
const cloudinary_config_1 = require("../../config/cloudinary.config");
const cart_model_1 = require("../cart/cart.model");
const order_model_1 = require("../order/order.model");
// create book
const createBook = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existingBook = yield book_model_1.Book.findOne({ title: payload.title });
    if (existingBook) {
        throw new AppError_1.default(401, `${payload.title} এই বইটি পোস্ট করা আছে . `);
    }
    if (payload.discount) {
        const discount = payload.discount;
        if (discount < 0 || discount > 100) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Discount must be between 0 and 100");
        }
        const price = payload.price;
        if (price < 0) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Price must be a positive number");
        }
        payload.discountedPrice = (price * discount) / 100;
        payload.price = Math.round(price - payload.discountedPrice);
    }
    const newBook = yield book_model_1.Book.create(payload);
    return newBook;
});
// get all book
const getAllBook = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryBuilder = new QueryBuilder_1.QueryBuilder(book_model_1.Book.find(), query);
    yield queryBuilder.filter();
    queryBuilder.search(book_constants_1.bookSearchableFields).sort().paginate();
    const [data, meta] = yield Promise.all([
        queryBuilder.build().populate("genre", "name"),
        queryBuilder.getMeta(),
    ]);
    return { data, meta };
});
// get single book with slug
const getSingleBook = (slug) => __awaiter(void 0, void 0, void 0, function* () {
    const book = yield book_model_1.Book.findOne({ slug });
    return book;
});
// get book by genre
const getBookByGenre = (genre) => __awaiter(void 0, void 0, void 0, function* () {
    return yield book_model_1.Book.find({ genre: genre });
});
// update a book
const updateBook = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isBookExist = yield book_model_1.Book.findById(id);
    if (!isBookExist) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Book Not Found");
    }
    if (payload.coverImage) {
        // if cover image is provided, delete the old coverImage
        if (isBookExist.coverImage) {
            yield (0, cloudinary_config_1.deleteImageFromCLoudinary)(isBookExist.coverImage);
        }
    }
    else {
        // if cover image is not provided, keep the existing coverImage
        payload.coverImage = isBookExist.coverImage;
    }
    if (payload.previewImages &&
        payload.previewImages.length > 0 &&
        isBookExist.previewImages &&
        isBookExist.previewImages.length > 0) {
        payload.previewImages = [
            ...payload.previewImages,
            ...isBookExist.previewImages,
        ];
    }
    if (payload.deletePreviewImages &&
        payload.deletePreviewImages.length > 0 &&
        isBookExist.previewImages &&
        isBookExist.previewImages.length > 0) {
        const restDBImages = isBookExist.previewImages.filter((imageUrl) => { var _a; return !((_a = payload.deletePreviewImages) === null || _a === void 0 ? void 0 : _a.includes(imageUrl)); });
        const updatedPayloadImages = (payload.previewImages || [])
            .filter((imageUrl) => { var _a; return !((_a = payload.deletePreviewImages) === null || _a === void 0 ? void 0 : _a.includes(imageUrl)); })
            .filter((imageUrl) => !restDBImages.includes(imageUrl));
        payload.previewImages = [...restDBImages, ...updatedPayloadImages];
    }
    const updatedBook = yield book_model_1.Book.findByIdAndUpdate(id, payload, { new: true });
    if (payload.deletePreviewImages &&
        payload.deletePreviewImages.length > 0 &&
        isBookExist.previewImages &&
        isBookExist.previewImages.length > 0) {
        yield Promise.all(payload.deletePreviewImages.map((url) => (0, cloudinary_config_1.deleteImageFromCLoudinary)(url)));
    }
    return updatedBook;
});
// delete a book
const deleteBook = (id) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const isBookExist = yield book_model_1.Book.findById(id);
    if (!isBookExist) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Book Not Found");
    }
    // 1. delete coverImage from cloudinary
    (0, cloudinary_config_1.deleteImageFromCLoudinary)(isBookExist.coverImage);
    // 2. delete preview images from cloudinary
    (_a = isBookExist.previewImages) === null || _a === void 0 ? void 0 : _a.map((img) => (0, cloudinary_config_1.deleteImageFromCLoudinary)(img));
    // 3. remove book references from OrderItems
    yield order_model_1.Order.updateMany({}, {
        $pull: {
            items: { book: isBookExist._id },
        },
    });
    // 4. remove book references from CartItems
    yield cart_model_1.Cart.deleteMany({ book: isBookExist._id });
    // 5. finally delete the book
    yield book_model_1.Book.findByIdAndDelete(id);
    return isBookExist;
});
exports.BookServices = {
    createBook,
    getAllBook,
    getSingleBook,
    getBookByGenre,
    deleteBook,
    updateBook,
};
