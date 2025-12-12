import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

import { IAuthorPayload } from "./author.interface";
import { AuthorServices } from "./author.service";

// Controller to create an author
const createAuthor = catchAsync(async (req: Request, res: Response) => {
  // Assuming 'file' field is used for image upload via multer
  const profileImagePath = req.file?.path;
  const payload: IAuthorPayload = {
    ...req.body,
    profileImage: profileImagePath,
  };

  const newAuthor = await AuthorServices.createAuthor(payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Author created successfully.",
    data: newAuthor,
  });
});

// Controller to get all authors
const getAllAuthors = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthorServices.getAllAuthors(
    req.query as Record<string, string>
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Authors retrieved successfully.",
    data: result.data,
    meta: result.meta,
  });
});

// Controller to get a single author
const getSingleAuthor = catchAsync(async (req: Request, res: Response) => {
  const { slug } = req.params;
  const author = await AuthorServices.getSingleAuthor(slug);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Author retrieved successfully.",
    data: author,
  });
});

// Controller to update an author
const updateAuthor = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  let profileImagePath: string | undefined;

  // Handle file upload for profile image update
  if (!Array.isArray(req.files)) {
    profileImagePath = req.files?.file?.[0]?.path;
  }

  const payload: Partial<IAuthorPayload> = {
    ...req.body,
    profileImage: profileImagePath,
  };

  const updatedAuthor = await AuthorServices.updateAuthor(id, payload);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Author updated successfully.",
    data: updatedAuthor,
  });
});

// Controller to delete an author (soft delete)
const deleteAuthor = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await AuthorServices.deleteAuthor(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Author deleted successfully.",
    data: null,
  });
});

export const AuthorControllers = {
  createAuthor,
  getAllAuthors,
  getSingleAuthor,
  updateAuthor,
  deleteAuthor,
};
