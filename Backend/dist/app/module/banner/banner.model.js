"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Banner = void 0;
const mongoose_1 = require("mongoose");
const bannerSchema = new mongoose_1.Schema({
    title: { type: String, required: true, trim: true },
    image: { type: String, required: true },
    link: { type: String },
    active: { type: Boolean, default: true },
    startDate: { type: Date },
    endDate: { type: Date },
}, { timestamps: true });
exports.Banner = (0, mongoose_1.model)("Banner", bannerSchema);
