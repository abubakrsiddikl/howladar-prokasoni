import { Schema, model } from "mongoose";
import { IGenre } from "./genre.interface";

const genreSchema = new Schema<IGenre>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, unique: true, trim: true },
    description: { type: String },
  },
  {
    timestamps: true,
  }
);

// slug generate before save
genreSchema.pre("save", async function (next) {
  if (this.isModified("name")) {
    const baseSlug = this.name.toLowerCase().split(" ").join("-");
    let slug = `${baseSlug}`;

    let counter = 0;
    while (await Genre.exists({ slug })) {
      slug = `${slug}-${counter++}`; //  counter to ensure uniqueness
    }

    this.slug = slug;
  }
  next();
});

genreSchema.pre("findOneAndUpdate", async function (next) {
  const genre = this.getUpdate() as Partial<IGenre>;

  if (genre.name) {
    const baseSlug = genre.name.toLowerCase().split(" ").join("-");
    let slug = `${baseSlug}`;

    let counter = 0;
    while (await Genre.exists({ slug })) {
      slug = `${slug}-${counter++}`; //  counter to ensure uniqueness
    }

    genre.slug = slug;
  }

  this.setUpdate(genre);

  next();
});
export const Genre = model<IGenre>("Genre", genreSchema);
