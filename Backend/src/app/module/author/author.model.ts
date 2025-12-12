import { Schema, model } from "mongoose";
import { IAuthor } from "./author.interface";

const authorSchema = new Schema<IAuthor>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: false,
      unique: true,
    },
    bio: {
      type: String,
      default: "",
    },
    birthDate: {
      type: Date,
      default: null,
    },
    profileImage: {
      type: String,
      default: "",
    },
    isDeleted: {
      type: Boolean,
      default: false,
      select: 0, // Do not return this field by default
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

// create slug
authorSchema.pre("save", async function (next) {
  if (this.isModified("name")) {
    const baseSlug = this.name.toLowerCase().split(" ").join("-");
    let slug = `${baseSlug}`;

    let counter = 0;
    while (await Author.exists({ slug })) {
      slug = `${slug}-${counter++}`; //  counter to ensure uniqueness
    }

    this.slug = slug;
  }
  next();
});

authorSchema.pre("findOneAndUpdate", async function (next) {
  const author = this.getUpdate() as Partial<IAuthor>;

  if (author.name) {
    const baseSlug = author.name.toLowerCase().split(" ").join("-");
    let slug = `${baseSlug}`;

    let counter = 0;
    while (await Author.exists({ slug })) {
      slug = `${slug}-${counter++}`; //  counter to ensure uniqueness
    }

    author.slug = slug;
  }

  this.setUpdate(author);

  next();
});

// Query Middleware to filter out deleted documents
authorSchema.pre("find", function (next) {
  this.where({ isDeleted: { $ne: true } });
  next();
});

authorSchema.pre("findOne", function (next) {
  this.where({ isDeleted: { $ne: true } });
  next();
});

authorSchema.virtual("totalBooks", {
  ref: "Book",
  localField: "_id",
  foreignField: "author",
  count: true,
});

authorSchema.virtual("books", {
  ref: "Book",
  localField: "_id",
  foreignField: "author",
});

export const Author = model<IAuthor>("Author", authorSchema);
