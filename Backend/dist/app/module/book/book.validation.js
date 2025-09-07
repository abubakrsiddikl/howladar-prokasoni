"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterBookZodSchema = exports.updateBookZodSchema = exports.createBookZodSchema = void 0;
const zod_1 = require("zod");
const book_interface_1 = require("./book.interface");
exports.createBookZodSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, "Title is required"),
    author: zod_1.z.string().min(1, "Author is required"),
    price: zod_1.z.number().min(0, "Price must be a positive number"),
    stock: zod_1.z.number().int().min(0, "Stock must be a non-negative integer"),
    genre: zod_1.z.nativeEnum(book_interface_1.Genre),
    discount: zod_1.z.number().min(0).max(100, "Discount must be between 0 and 100"),
    description: zod_1.z.string().max(2000).optional(),
    coverImage: zod_1.z.string().url("Cover image must be a valid URL").optional(),
    previewImages: zod_1.z
        .array(zod_1.z.string().url("Preview images must be valid URLs"))
        .optional(),
    available: zod_1.z.boolean().optional(),
});
exports.updateBookZodSchema = exports.createBookZodSchema.partial().extend({
    deletePreviewImages: zod_1.z.array(zod_1.z.string()).optional(),
});
exports.filterBookZodSchema = zod_1.z.object({
    search: zod_1.z.string().optional(),
    genre: zod_1.z.nativeEnum(book_interface_1.Genre).optional(),
    page: zod_1.z.number().int().positive().optional(),
    limit: zod_1.z.number().int().positive().optional(),
});
