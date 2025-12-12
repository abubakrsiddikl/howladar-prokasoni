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
exports.Book = void 0;
const mongoose_1 = require("mongoose");
const bookSchema = new mongoose_1.Schema({
    title: { type: String, required: true, trim: true },
    author: { type: mongoose_1.Schema.Types.ObjectId, ref: "Author", required: true },
    // author: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0 },
    genre: { type: mongoose_1.Schema.Types.ObjectId, ref: "Genre", required: true },
    discount: { type: Number, min: 0, max: 100 },
    // If discount is applied, this field will be calculated
    // and stored in the database.
    discountedPrice: { type: Number, min: 0, default: 0 },
    description: { type: String, maxLength: 2000 },
    coverImage: { type: String, required: true },
    previewImages: [{ type: String }],
    available: { type: Boolean, default: true },
    publisher: { type: String, required: false },
    slug: { type: String, unique: true, trim: true },
}, {
    timestamps: true,
});
// create slug
bookSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.isModified("title")) {
            const baseSlug = this.title.toLowerCase().split(" ").join("-");
            let slug = `${baseSlug}`;
            let counter = 0;
            while (yield exports.Book.exists({ slug })) {
                slug = `${slug}-${counter++}`; //  counter to ensure uniqueness
            }
            this.slug = slug;
        }
        next();
    });
});
bookSchema.pre("findOneAndUpdate", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const book = this.getUpdate();
        if (book.title) {
            const baseSlug = book.title.toLowerCase().split(" ").join("-");
            let slug = `${baseSlug}`;
            let counter = 0;
            while (yield exports.Book.exists({ slug })) {
                slug = `${slug}-${counter++}`; //  counter to ensure uniqueness
            }
            book.slug = slug;
        }
        this.setUpdate(book);
        next();
    });
});
// Stock check
bookSchema.pre("save", function (next) {
    this.available = this.stock > 0;
    next();
});
exports.Book = (0, mongoose_1.model)("Book", bookSchema);
