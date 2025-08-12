import { Schema, model } from "mongoose";
import { IBook, Genre } from "./book.interface";

const bookSchema = new Schema<IBook>(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0 },
    genre: { type: String, enum: Object.values(Genre), required: true },
    discount: { type: Number, required: true, min: 0, max: 100 },
    description: { type: String, maxLength: 2000 },
    coverImage: { type: String, required: true },
    available: { type: Boolean, default: true },
    slug: { type: String, unique: true, trim: true },
  },
  {
    timestamps: true,
  }
);

// create slug
bookSchema.pre("save", async function (next) {
  if (this.isModified("title")) {
    const baseSlug = this.title.toLowerCase().split(" ").join("-");
    let slug = `${baseSlug}`;

    let counter = 0;
    while (await Book.exists({ slug })) {
      slug = `${slug}-${counter++}`; //  counter to ensure uniqueness
    }

    this.slug = slug;
  }
  next();
});
bookSchema.pre("findOneAndUpdate", async function (next) {
  const book = this.getUpdate() as Partial<IBook>;

  if (book.title) {
    const baseSlug = book.title.toLowerCase().split(" ").join("-");
    let slug = `${baseSlug}`;

    let counter = 0;
    while (await Book.exists({ slug })) {
      slug = `${slug}-${counter++}`; //  counter to ensure uniqueness
    }

    book.slug = slug;
  }

  this.setUpdate(book);

  next();
});

// Stock check
bookSchema.pre("save", function (next) {
  this.available = this.stock > 0;
  next();
});

export const Book = model<IBook>("Book", bookSchema);
