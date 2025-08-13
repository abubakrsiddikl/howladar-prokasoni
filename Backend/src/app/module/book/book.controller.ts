import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { BookServices } from "./book.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";

// create book
const createBook = catchAsync(async (req: Request, res: Response) => {
  console.log(req.file)
  const payload = req.body;
  return 
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
    data: books,
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

// update a book
const updateBook = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const updatedBook = await BookServices.updateBook(id, req.body);
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
  updateBook,
  deleteBook,
};
