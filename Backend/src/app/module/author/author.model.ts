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

export const Author = model<IAuthor>("Author", authorSchema);
