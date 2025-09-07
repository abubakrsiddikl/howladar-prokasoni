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
exports.BookControllers = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const book_service_1 = require("./book.service");
const sendResponse_1 = require("../../utils/sendResponse");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
// create book
const createBook = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    let coverImagePath;
    let previewImagePaths = [];
    if (!Array.isArray(req.files)) {
        coverImagePath = (_c = (_b = (_a = req.files) === null || _a === void 0 ? void 0 : _a.file) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.path;
        previewImagePaths = ((_e = (_d = req.files) === null || _d === void 0 ? void 0 : _d.files) === null || _e === void 0 ? void 0 : _e.map((file) => file.path)) || [];
    }
    const payload = Object.assign(Object.assign({}, req.body), { coverImage: coverImagePath, previewImages: previewImagePaths });
    const newBook = yield book_service_1.BookServices.createBook(payload);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Book create successfully .",
        data: newBook,
    });
}));
// get all book
const getAllBook = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const books = yield book_service_1.BookServices.getAllBook(req.query);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Book retrieve successfully",
        data: books.data,
        meta: books.meta,
    });
}));
// get single book with slug
const getSingleBook = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const slug = req.params.slug;
    const book = yield book_service_1.BookServices.getSingleBook(slug);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Book retrieve successfully",
        data: book,
    });
}));
// get book by genre
const getBookByGenre = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const genre = req.params.genre;
    const book = yield book_service_1.BookServices.getBookByGenre(genre);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Book retrieve successfully",
        data: book,
    });
}));
// update a book
const updateBook = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    const id = req.params.id;
    let coverImagePath;
    let previewImagePaths = [];
    if (!Array.isArray(req.files)) {
        coverImagePath = (_c = (_b = (_a = req.files) === null || _a === void 0 ? void 0 : _a.file) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.path;
        previewImagePaths = ((_e = (_d = req.files) === null || _d === void 0 ? void 0 : _d.files) === null || _e === void 0 ? void 0 : _e.map((file) => file.path)) || [];
    }
    const payload = Object.assign(Object.assign({}, req.body), { coverImage: coverImagePath, previewImages: previewImagePaths });
    const updatedBook = yield book_service_1.BookServices.updateBook(id, payload);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Book updated successfully",
        data: updatedBook,
    });
}));
// delete a book
const deleteBook = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    yield book_service_1.BookServices.deleteBook(id);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Book deleted successfully",
        data: null,
    });
}));
exports.BookControllers = {
    createBook,
    getAllBook,
    getSingleBook,
    getBookByGenre,
    updateBook,
    deleteBook,
};
