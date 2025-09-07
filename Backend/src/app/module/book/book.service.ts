import { IBook } from "./book.interface";

import AppError from "../../errorHelper/AppError";
import httpStatus from "http-status-codes";
import { Book } from "./book.model";
import { bookSearchableFields } from "./book.constants";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { deleteImageFromCLoudinary } from "../../config/cloudinary.config";

// create book
const createBook = async (payload: IBook) => {
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

  const books = queryBuilder
    .search(bookSearchableFields)
    .filter()
    .sort()
    .paginate();

  // const meta = await queryBuilder.getMeta();
  const [data, meta] = await Promise.all([
    books.build(),
    queryBuilder.getMeta(),
  ]);

  return {
    data,
    meta,
  };
};

// get single book with slug
const getSingleBook = async (slug: string) => {
  const book = await Book.findOne({ slug });
  return book;
};

// get book by genre
const getBookByGenre = async (genre: string) => {
  return await Book.find({ genre: genre });
};

// update a book
const updateBook = async (id: string, payload: Partial<IBook>) => {
  const isBookExist = await Book.findById(id);
  if (!isBookExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "Book Not Found");
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
  if (
    payload.previewImages &&
    payload.previewImages.length > 0 &&
    isBookExist.previewImages &&
    isBookExist.previewImages.length > 0
  ) {
    payload.previewImages = [
      ...payload.previewImages,
      ...isBookExist.previewImages,
    ];
  }
  if (
    payload.deletePreviewImages &&
    payload.deletePreviewImages.length > 0 &&
    isBookExist.previewImages &&
    isBookExist.previewImages.length > 0
  ) {
    const restDBImages = isBookExist.previewImages.filter(
      (imageUrl) => !payload.deletePreviewImages?.includes(imageUrl)
    );
    const updatedPayloadImages = (payload.previewImages || [])
      .filter((imageUrl) => !payload.deletePreviewImages?.includes(imageUrl))
      .filter((imageUrl) => !restDBImages.includes(imageUrl));

    payload.previewImages = [...restDBImages, ...updatedPayloadImages];
  }
  const updatedBook = await Book.findByIdAndUpdate(id, payload, { new: true });
  if (
    payload.deletePreviewImages &&
    payload.deletePreviewImages.length > 0 &&
    isBookExist.previewImages &&
    isBookExist.previewImages.length > 0
  ) {
    await Promise.all(
      payload.deletePreviewImages.map((url) => deleteImageFromCLoudinary(url))
    );
  }
  return updatedBook;
};

// delete a book
const deleteBook = async (id: string) => {
  const isBookExist = await Book.findById(id);
  if (!isBookExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "Book Not Found");
  }
  // delete coverImage
  deleteImageFromCLoudinary(isBookExist.coverImage);
  // delete preview image
  isBookExist.previewImages?.map((img) => deleteImageFromCLoudinary(img));
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
