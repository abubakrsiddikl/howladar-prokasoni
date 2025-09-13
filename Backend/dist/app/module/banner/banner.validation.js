"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bannerUpdateZodSchema = exports.bannerCreateZodSchema = void 0;
const zod_1 = require("zod");
exports.bannerCreateZodSchema = zod_1.z.object({
    title: zod_1.z.string().min(3, "Title must be at least 3 characters"),
    link: zod_1.z.string().optional(),
    active: zod_1.z.boolean(),
    startDate: zod_1.z.string().optional(),
    endDate: zod_1.z.string().optional(),
});
exports.bannerUpdateZodSchema = zod_1.z.object({
    title: zod_1.z.string().min(3, "Title must be at least 3 characters").optional(),
    link: zod_1.z.string().optional(),
    active: zod_1.z.boolean(),
    startDate: zod_1.z.string().optional(),
    endDate: zod_1.z.string().optional(),
});
