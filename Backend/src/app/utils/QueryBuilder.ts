/* eslint-disable @typescript-eslint/no-explicit-any */
import { Query } from "mongoose";
import { excludeField } from "../constants";
import { Genre } from "../module/genre/genre.model";

export class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public readonly query: Record<string, string>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, string>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  async filter(): Promise<this> {
    // const filter = { ...this.query };
    // if (filter.genre) {
    //   const genreDoc = await Genre.findOne({
    //     name: { $regex: filter.genre, $options: "i" },
    //   });
    //   if (genreDoc) {
    //     filter.genre = genreDoc._id;
    //   } else {
    //     delete filter.genre;
    //   }
    // }
    // for (const field of excludeField) {
    //   // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    //   delete filter[field];
    // }

    // this.modelQuery = this.modelQuery.find(filter);

    // return this;
    const filter: any = { ...this.query };

    if (filter.genre && Array.isArray(filter.genre)) {
      const genreNames = filter.genre as string[];

      const genreDocs = await Genre.find({
        name: { $in: genreNames.map((name) => new RegExp(name, "i")) },
      });
      const validGenreIds = genreDocs.map((doc) => doc._id);

      if (validGenreIds.length > 0) {
        filter.genre = { $in: validGenreIds };
      } else {
        delete filter.genre;
      }
    } else if (filter.genre && typeof filter.genre === "string") {
      const regexPattern = new RegExp(`^${filter.genre}$`, "i");

      const genreDoc = await Genre.findOne({
        name: { $regex: regexPattern },
      });

      if (genreDoc) {
        filter.genre = genreDoc._id;
      } else {
        delete filter.genre;
      }
    }

    for (const field of excludeField) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete filter[field];
    }

    this.modelQuery = this.modelQuery.find(filter);

    return this;
  }

  search(searchableField: string[]): this {
    const searchTerm = this.query.searchTerm || "";

    const searchQuery = {
      $or: searchableField.map((field) => ({
        [field]: { $regex: searchTerm, $options: "i" },
      })),
    };
    this.modelQuery = this.modelQuery.find(searchQuery);
    return this;
  }

  sort(): this {
    const sort = this.query.sort || "-createdAt";
    this.modelQuery = this.modelQuery.sort(sort);

    return this;
  }
  fields(): this {
    const fields = this.query.fields?.split(",").join(" ") || "";

    this.modelQuery = this.modelQuery.select(fields);

    return this;
  }
  paginate(): this {
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 10;
    const skip = (page - 1) * limit;

    this.modelQuery = this.modelQuery.skip(skip).limit(limit);

    return this;
  }

  build() {
    return this.modelQuery;
  }

  async getMeta() {
    const totalDocuments = await this.modelQuery.model.countDocuments();
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 10;

    const totalPage = Math.ceil(totalDocuments / limit);

    return { page, limit, total: totalDocuments, totalPage };
  }
}
