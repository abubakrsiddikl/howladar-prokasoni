import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { BookServices } from "./book.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";

// create book
const createBook = catchAsync(async (req: Request, res: Response) => {
  let coverImagePath: string | undefined;
  let previewImagePaths: string[] = [];

  if (!Array.isArray(req.files)) {
    coverImagePath = req.files?.file?.[0]?.path;
    previewImagePaths = req.files?.files?.map((file) => file.path) || [];
  }
  const payload = {
    ...req.body,
    coverImage: coverImagePath,
    previewImages: previewImagePaths,
  };

  const newBook = await BookServices.createBook(payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Book create successfully .",
    data: newBook,
  });
});

// get all book
const getAllBook = catchAsync(async (req: Request, res: Response) => {
  const books = await BookServices.getAllBook(
    req.query as Record<string, string>
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Book retrieve successfully",
    data: books.data,
    meta: books.meta,
  });
});

// get single book with slug
const getSingleBook = catchAsync(async (req: Request, res: Response) => {
  const slug = req.params.slug;
  const book = await BookServices.getSingleBook(slug);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Book retrieve successfully",
    data: book,
  });
});

// get book by genre
const getBookByGenre = catchAsync(async (req: Request, res: Response) => {
  const genre = req.params.genre;
  const book = await BookServices.getBookByGenre(genre);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Book retrieve successfully",
    data: book,
  });
});

// update a book
const updateBook = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  let coverImagePath: string | undefined;
  let previewImagePaths: string[] = [];

  if (!Array.isArray(req.files)) {
    coverImagePath = req.files?.file?.[0]?.path;
    previewImagePaths = req.files?.files?.map((file) => file.path) || [];
  }
  const payload = {
    ...req.body,
    coverImage: coverImagePath,
    previewImages: previewImagePaths,
  };
  const updatedBook = await BookServices.updateBook(id, payload);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Book updated successfully",
    data: updatedBook,
  });
});

// delete a book
const deleteBook = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  await BookServices.deleteBook(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Book deleted successfully",
    data: null,
  });
});

export const BookControllers = {
  createBook,
  getAllBook,
  getSingleBook,
  getBookByGenre,
  updateBook,
  deleteBook,
};
