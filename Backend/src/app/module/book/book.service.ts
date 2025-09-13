import { IBook } from "./book.interface";

import AppError from "../../errorHelper/AppError";
import httpStatus from "http-status-codes";
import { Book } from "./book.model";
import { bookSearchableFields } from "./book.constants";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { deleteImageFromCLoudinary } from "../../config/cloudinary.config";
import { Cart } from "../cart/cart.model";
import { Order } from "../order/order.model";

// create book
const createBook = async (payload: IBook) => {
  const existingBook = await Book.findOne({ title: payload.title });
  if (existingBook) {
    throw new AppError(401, `${payload.title} এই বইটি পোস্ট করা আছে . `);
  }

  if (payload.discount) {
    const discount = payload.discount;
    if (discount < 0 || discount > 100) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Discount must be between 0 and 100"
      );
    }
    const price = payload.price;
    if (price < 0) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Price must be a positive number"
      );
    }
    payload.discountedPrice = (price * discount) / 100;
    payload.price = Math.round(price - payload.discountedPrice);
  }
  const newBook = await Book.create(payload);
  return newBook;
};

// get all book
const getAllBook = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(Book.find(), query);

  await queryBuilder.filter();
  queryBuilder.search(bookSearchableFields).sort().paginate();

  const [data, meta] = await Promise.all([
    queryBuilder.build().populate("genre", "name"),
    queryBuilder.getMeta(),
  ]);

  return { data, meta };
};

// get single book with slug
const getSingleBook = async (slug: string) => {
  const book = await Book.findOne({ slug }).populate("genre");
  return book;
};

// get book by genre
const getBookByGenre = async (genre: string) => {
  return await Book.find({ genre: genre });
};

// update a book
const updateBook = async (id: string, payload: Partial<IBook>) => {
  const titleExist = await Book.findOne({
    title: payload.title,
    _id: { $ne: id },
  });
  if (titleExist) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `${payload.title} এই নামের বই ইতিমধ্যেই আপলোড করা আছে !`
    );
  }
  const isBookExist = await Book.findById(id);
  if (!isBookExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Book Not Found");
  }

  if (payload.coverImage) {
    // if cover image is provided, delete the old coverImage
    if (isBookExist.coverImage) {
      await deleteImageFromCLoudinary(isBookExist.coverImage);
    }
  } else {
    // if cover image is not provided, keep the existing coverImage
    payload.coverImage = isBookExist.coverImage;
  }

  // calculate discount price
  if (payload.discount !== undefined) {
    const discount = payload.discount;

    if (discount < 0 || discount > 100) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Discount must be between 0 and 100"
      );
    }

    // frontend send original price 
    const originalPrice = payload.price;
    if (originalPrice === undefined) {
      throw new AppError(httpStatus.BAD_REQUEST, "Price is required");
    }
    if (originalPrice < 0) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Price must be a positive number"
      );
    }

    // discount amount
    const discountAmount = (originalPrice * discount) / 100;

    // discount after price
    const finalPrice = Math.round(originalPrice - discountAmount);

    // DB to overwrite 
    payload.discountedPrice = discountAmount; // amount of discount
    payload.price = finalPrice; // final price off discountPrice
  }


  const updatedBook = await Book.findByIdAndUpdate(id, payload, { new: true });
  return updatedBook;
};

// delete a book
const deleteBook = async (id: string) => {
  const isBookExist = await Book.findById(id);
  if (!isBookExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "Book Not Found");
  }

  // 1. delete coverImage from cloudinary
  deleteImageFromCLoudinary(isBookExist.coverImage);

  // 2. delete preview images from cloudinary
  isBookExist.previewImages?.map((img) => deleteImageFromCLoudinary(img));

  // 3. remove book references from OrderItems
  await Order.updateMany(
    {},
    {
      $pull: {
        items: { book: isBookExist._id },
      },
    }
  );

  // 4. remove book references from CartItems
  await Cart.deleteMany({ book: isBookExist._id });

  // 5. finally delete the book
  await Book.findByIdAndDelete(id);

  return isBookExist;
};

export const BookServices = {
  createBook,
  getAllBook,
  getSingleBook,
  getBookByGenre,
  deleteBook,
  updateBook,
};
