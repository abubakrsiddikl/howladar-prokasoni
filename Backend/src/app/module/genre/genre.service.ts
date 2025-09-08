import { Genre } from "./genre.model";
import { IGenre } from "./genre.interface";
import AppError from "../../errorHelper/AppError";

// Create Genre
const createGenre = async (payload: IGenre) => {
  const existingGenre = await Genre.findOne({ name: payload.name });
  if (existingGenre) {
    throw new AppError(
      401,
      `${existingGenre.name} This genre already added to db `
    );
  }
  const genre = new Genre(payload);
  return await genre.save();
};

// Get All Genres
const getAllGenres = async () => {
  return await Genre.find();
};

// Get Single Genre by slug
const getGenreBySlug = async (slug: string) => {
  return await Genre.findOne({ slug });
};

// Update Genre
const updateGenre = async (slug: string, payload: Partial<IGenre>) => {
  // যদি payload এ name থাকে তাহলে check করতে হবে
  if (payload.name) {
    const existingGenre = await Genre.findOne({
      name: payload.name,
      slug: { $ne: slug }, // এই slug বাদ দিয়ে check করা
    });

    if (existingGenre) {
      throw new AppError(
        400,
        `${payload.name} already exists. Please choose a different name.`
      );
    }
  }

  // update করে নতুন document return করবো
  const updatedGenre = await Genre.findOneAndUpdate({ slug }, payload, {
    new: true,
    runValidators: true,
  });

  if (!updatedGenre) {
    throw new AppError(404, "Genre not found");
  }

  return updatedGenre;
};

// Delete Genre
const deleteGenre = async (id: string) => {
  return await Genre.findByIdAndDelete(id);
};

export const GenreService = {
  createGenre,
  getAllGenres,
  getGenreBySlug,
  updateGenre,
  deleteGenre,
};
