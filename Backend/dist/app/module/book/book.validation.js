"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterBookZodSchema = exports.updateBookZodSchema = exports.createBookZodSchema = void 0;
const zod_1 = require("zod");
exports.createBookZodSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, "Title is required"),
    author: zod_1.z.string().min(1, "Author is required"),
    price: zod_1.z.number().min(0, "Price must be positive"),
    stock: zod_1.z.number().int().min(0, "Stock must be non-negative"),
    genre: zod_1.z.string().min(1, "Genre is required"),
    discount: zod_1.z.number().min(0).max(100).optional(),
    discountedPrice: zod_1.z.number().min(0).optional(),
    description: zod_1.z.string().max(2000).optional(),
    coverImage: zod_1.z.string().url().optional(),
    previewImages: zod_1.z.array(zod_1.z.string().url()).optional(),
    available: zod_1.z.boolean().optional(),
    publisher: zod_1.z.string().optional(), // new field
});
exports.updateBookZodSchema = exports.createBookZodSchema.partial().extend({
    deletePreviewImages: zod_1.z.array(zod_1.z.string()).optional(),
});
exports.filterBookZodSchema = zod_1.z.object({
    search: zod_1.z.string().optional(),
    genre: zod_1.z.string().optional(), // filter by genre id or name
    page: zod_1.z.number().int().positive().optional(),
    limit: zod_1.z.number().int().positive().optional(),
});
