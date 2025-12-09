import { Schema, model } from "mongoose";
import { IBook } from "./book.interface";

const bookSchema = new Schema<IBook>(
  {
    title: { type: String, required: true, trim: true },
    author: { type: Schema.Types.ObjectId, ref: "Author", required: true },
    // author: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0 },
    genre: { type: Schema.Types.ObjectId, ref: "Genre", required: true },
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
