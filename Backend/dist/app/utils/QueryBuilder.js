"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryBuilder = void 0;
const constants_1 = require("../constants");
const genre_model_1 = require("../module/genre/genre.model");
class QueryBuilder {
    constructor(modelQuery, query) {
        this.modelQuery = modelQuery;
        this.query = query;
    }
    filter() {
        return __awaiter(this, void 0, void 0, function* () {
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
            const filter = Object.assign({}, this.query);
            if (filter.genre && Array.isArray(filter.genre)) {
                const genreNames = filter.genre;
                const genreDocs = yield genre_model_1.Genre.find({
                    name: { $in: genreNames.map((name) => new RegExp(name, "i")) },
                });
                const validGenreIds = genreDocs.map((doc) => doc._id);
                if (validGenreIds.length > 0) {
                    filter.genre = { $in: validGenreIds };
                }
                else {
                    delete filter.genre;
                }
            }
            else if (filter.genre && typeof filter.genre === "string") {
                const regexPattern = new RegExp(`^${filter.genre}$`, "i");
                const genreDoc = yield genre_model_1.Genre.findOne({
                    name: { $regex: regexPattern },
                });
                if (genreDoc) {
                    filter.genre = genreDoc._id;
                }
                else {
                    delete filter.genre;
                }
            }
            for (const field of constants_1.excludeField) {
                // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
                delete filter[field];
            }
            this.modelQuery = this.modelQuery.find(filter);
            return this;
        });
    }
    search(searchableField) {
        const searchTerm = this.query.searchTerm || "";
        const searchQuery = {
            $or: searchableField.map((field) => ({
                [field]: { $regex: searchTerm, $options: "i" },
            })),
        };
        this.modelQuery = this.modelQuery.find(searchQuery);
        return this;
    }
    sort() {
        const sort = this.query.sort || "-createdAt";
        this.modelQuery = this.modelQuery.sort(sort);
        return this;
    }
    fields() {
        var _a;
        const fields = ((_a = this.query.fields) === null || _a === void 0 ? void 0 : _a.split(",").join(" ")) || "";
        this.modelQuery = this.modelQuery.select(fields);
        return this;
    }
    paginate() {
        const page = Number(this.query.page) || 1;
        const limit = Number(this.query.limit) || 10;
        const skip = (page - 1) * limit;
        this.modelQuery = this.modelQuery.skip(skip).limit(limit);
        return this;
    }
    build() {
        return this.modelQuery;
    }
    getMeta() {
        return __awaiter(this, void 0, void 0, function* () {
            const totalDocuments = yield this.modelQuery.model.countDocuments();
            const page = Number(this.query.page) || 1;
            const limit = Number(this.query.limit) || 10;
            const totalPage = Math.ceil(totalDocuments / limit);
            return { page, limit, total: totalDocuments, totalPage };
        });
    }
}
exports.QueryBuilder = QueryBuilder;
