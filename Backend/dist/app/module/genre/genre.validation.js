"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateGenreValidationSchema = exports.createGenreValidationSchema = void 0;
const zod_1 = require("zod");
exports.createGenreValidationSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, "Name is required").max(50),
    description: zod_1.z.string().optional(),
});
exports.updateGenreValidationSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).max(50).optional(),
    description: zod_1.z.string().optional(),
});
