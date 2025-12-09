import httpStatus from "http-status-codes";
import AppError from "../../errorHelper/AppError";
import { IAuthorPayload } from "../author/author.interface";
import { Author } from "../author/author.model";
import { QueryBuilder } from "../../utils/QueryBuilder";

// Create a new author
const createAuthor = async (payload: IAuthorPayload) => {
  const existingAuthor = await Author.findOne({ name: payload.name });
  if (existingAuthor) {
    throw new AppError(httpStatus.CONFLICT, "Author already exists.");
  }

  const newAuthor = await Author.create(payload);
  return newAuthor;
};

// Get all authors
const getAllAuthors = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(Author.find(), query);

  await queryBuilder.filter();
  queryBuilder.search(["name"]).sort().paginate();

  const [data, meta] = await Promise.all([
    queryBuilder.build().populate("totalBooks"),
    queryBuilder.getMeta(),
  ]);

  return { data, meta };
};

// Get a single author by ID
const getSingleAuthor = async (id: string) => {
  const author = await Author.findById(id);
  if (!author) {
    throw new AppError(httpStatus.NOT_FOUND, "Author not found.");
  }
  return author;
};

// Update an author
const updateAuthor = async (id: string, payload: Partial<IAuthorPayload>) => {
  // Check for unique name during update
  if (payload.name) {
    const existingAuthor = await Author.findOne({
      name: payload.name,
      _id: { $ne: id },
    });
    if (existingAuthor) {
      throw new AppError(httpStatus.CONFLICT, "Author name already in use.");
    }
  }

  const updatedAuthor = await Author.findByIdAndUpdate(id, payload, {
    new: true,
  });
  if (!updatedAuthor) {
    throw new AppError(httpStatus.NOT_FOUND, "Author not found.");
  }
  return updatedAuthor;
};

// Soft delete an author
const deleteAuthor = async (id: string) => {
  const deletedAuthor = await Author.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );

  if (!deletedAuthor) {
    throw new AppError(httpStatus.NOT_FOUND, "Author not found.");
  }
  return deletedAuthor;
};

export const AuthorServices = {
  createAuthor,
  getAllAuthors,
  getSingleAuthor,
  updateAuthor,
  deleteAuthor,
};
