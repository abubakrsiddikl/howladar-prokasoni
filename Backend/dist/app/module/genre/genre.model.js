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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Genre = void 0;
const mongoose_1 = require("mongoose");
const genreSchema = new mongoose_1.Schema({
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, unique: true, trim: true },
    description: { type: String },
}, {
    timestamps: true,
});
// slug generate before save
genreSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.isModified("name")) {
            const baseSlug = this.name.toLowerCase().split(" ").join("-");
            let slug = `${baseSlug}`;
            let counter = 0;
            while (yield exports.Genre.exists({ slug })) {
                slug = `${slug}-${counter++}`; //  counter to ensure uniqueness
            }
            this.slug = slug;
        }
        next();
    });
});
genreSchema.pre("findOneAndUpdate", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const genre = this.getUpdate();
        if (genre.name) {
            const baseSlug = genre.name.toLowerCase().split(" ").join("-");
            let slug = `${baseSlug}`;
            let counter = 0;
            while (yield exports.Genre.exists({ slug })) {
                slug = `${slug}-${counter++}`; //  counter to ensure uniqueness
            }
            genre.slug = slug;
        }
        this.setUpdate(genre);
        next();
    });
});
exports.Genre = (0, mongoose_1.model)("Genre", genreSchema);
