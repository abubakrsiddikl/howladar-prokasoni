import { JwtPayload } from "jsonwebtoken";
import { IBook } from "./book.interface";
import { Role } from "../user/user.interface";
import AppError from "../../errorHelper/AppError";
import httpStatus from "http-status-codes";
import { Book } from "./book.model";
import { bookSearchableFields } from "./tour.constants";
import { QueryBuilder } from "../../utils/QueryBuilder";

// create book
const createBook = async (payload: IBook, decodedToken: JwtPayload) => {
  if (
    decodedToken.role !== Role.ADMIN &&
    decodedToken.role !== Role.STORE_MANAGER
  ) {
    throw new AppError(httpStatus.FORBIDDEN, "You are not authorized !");
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

// update a book
const updateBook = async (id: string, payload: Partial<IBook>) => {
  const isBookExist = await Book.findById(id);
  if (!isBookExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "Book Not Found");
  }
  const updatedBook = await Book.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return updatedBook;
};

// delete a book
const deleteBook = async (id: string) => {
  const isBookExist = await Book.findById(id);
  if (!isBookExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "Book Not Found");
  }
  await Book.findByIdAndDelete(id);
  return isBookExist;
};

export const BookServices = {
  createBook,
  getAllBook,
  getSingleBook,
  deleteBook,
  updateBook,
};
