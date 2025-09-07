"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addToCartZodSchema = void 0;
const zod_1 = require("zod");
exports.addToCartZodSchema = zod_1.z.object({
    bookId: zod_1.z.string({ required_error: "Book ID is required" }),
    quantity: zod_1.z
        .number({ required_error: "Quantity is required" })
        .min(1, "Quantity must be at least 1"),
});
