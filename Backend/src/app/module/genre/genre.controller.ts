import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { GenreService } from "./genre.service";

// Create Genre
const createGenre = catchAsync(async (req: Request, res: Response) => {
  const result = await GenreService.createGenre(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Genre created successfully",
    data: result,
  });
});

// Get All Genres
const getAllGenres = catchAsync(async (req: Request, res: Response) => {
  const result = await GenreService.getAllGenres(
    req.query as Record<string, string>
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Genres retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

// sorted genre by book
const getSortedGenresByBookCount = catchAsync(
  async (req: Request, res: Response) => {
    
    const result = await GenreService.getSortedGenresByBookCount();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Sorted Genres retrieved successfully",
      data: result,
    });
  }
);

// Get Single Genre by Slug
const getGenreBySlug = catchAsync(async (req: Request, res: Response) => {
  const { slug } = req.params;
  const result = await GenreService.getGenreBySlug(slug);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Genre retrieved successfully",
    data: result,
  });
});

// Update Genre
const updateGenre = catchAsync(async (req: Request, res: Response) => {
  const { slug } = req.params;
  const result = await GenreService.updateGenre(slug, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Genre updated successfully",
    data: result,
  });
});

// Delete Genre
const deleteGenre = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await GenreService.deleteGenre(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Genre deleted successfully",
    data: result,
  });
});

export const GenreController = {
  createGenre,
  getAllGenres,
  getSortedGenresByBookCount,
  getGenreBySlug,
  updateGenre,
  deleteGenre,
};
