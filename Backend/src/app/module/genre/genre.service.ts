import { Genre } from "./genre.model";
import { IGenre } from "./genre.interface";
import AppError from "../../errorHelper/AppError";
import { QueryBuilder } from "../../utils/QueryBuilder";
import httpStatus from "http-status-codes";
import mongoose from "mongoose";
import { Book } from "../book/book.model";
import { deleteImageFromCLoudinary } from "../../config/cloudinary.config";
import { Order } from "../order/order.model";
import { Cart } from "../cart/cart.model";

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
const getAllGenres = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(Genre.find(), query);

  await queryBuilder.filter();
  queryBuilder.search(["name"]).sort().paginate();

  const [data, meta] = await Promise.all([
    queryBuilder.build(),
    queryBuilder.getMeta(),
  ]);

  return { data, meta };
};

// get sorted genre by book
const getSortedGenresByBookCount = async () => {
  const sortedGenres = await Genre.aggregate([
    // 1. জেনরগুলোকে তাদের বইয়ের সাথে যুক্ত করা
    {
      $lookup: {
        from: "books", // বই কালেকশনের নাম (ছোট হাতের এবং plural)
        localField: "_id",
        foreignField: "genre",
        as: "books",
      },
    },
    // 2. বইয়ের সংখ্যা (count) গণনা করা
    {
      $addFields: {
        bookCount: { $size: "$books" },
      },
    },
    // 3. বইয়ের সংখ্যা অনুসারে ডিসেন্ডিং অর্ডারে সাজানো
    {
      $sort: { bookCount: -1 },
    },
    // 4. যে জেনরগুলোর বই নেই (bookCount: 0) সেগুলোকে ফিল্টার করে বাদ দেওয়া
    {
      $match: {
        bookCount: { $gt: 0 }, // 0 এর বেশি বই আছে এমন জেনরগুলো রাখো
      },
    },
    // 5. অপ্রয়োজনীয় 'books' অ্যারে বাদ দেওয়া
    {
      $project: {
        books: 0,
      },
    },
  ]);
  

  return sortedGenres;
};

// Get Single Genre by slug
const getGenreBySlug = async (slug: string) => {
  return await Genre.findOne({ slug });
};

// Update Genre
const updateGenre = async (slug: string, payload: Partial<IGenre>) => {
  if (payload.name) {
    const existingGenre = await Genre.findOne({
      name: payload.name,
      slug: { $ne: slug },
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
  const isGenreExist = await Genre.findById(id);
  if (!isGenreExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Genre not found");
  }

  // 2. start session
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // 3. find genre reference book
    const booksToDelete = await Book.find({ genre: id }).session(session);

    // 4. start book delete
    if (booksToDelete.length > 0) {
      for (const book of booksToDelete) {
        // A. delete cloudinary image
        deleteImageFromCLoudinary(book.coverImage);
        book.previewImages?.map((img) => deleteImageFromCLoudinary(img));

        // B. OrderItems to delete book reference
        await Order.updateMany(
          {},
          {
            $pull: {
              items: { book: book._id },
            },
          },
          { session } // pass transaction
        );

        // C. CartItems to delete book reference
        await Cart.deleteMany({ book: book._id }, { session });

        // D. Finally delete book
        await Book.findByIdAndDelete(book._id, { session });
      }
    }

    // 5. after all book delete then genre delete
    const deletedGenre = await Genre.findByIdAndDelete(id, { session });

    if (!deletedGenre) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to delete genre");
    }

    // 6. if success all operation commit session
    await session.commitTransaction();
    session.endSession();

    return deletedGenre;
  } catch (error) {
    // if error to roll back
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const GenreService = {
  createGenre,
  getAllGenres,
  getSortedGenresByBookCount,
  getGenreBySlug,
  updateGenre,
  deleteGenre,
};
