import { baseApi } from "@/redux/baseApi";
import type { IBook, IBookCreate, IResponse } from "@/types";

const bookApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // add new book
    addNewBook: builder.mutation<IResponse<IBookCreate>, FormData>({
      query: (payload) => ({
        url: "/book/create",
        method: "POST",
        data: payload,
      }),
      invalidatesTags: ["BOOK"],
    }),

    // get all book
    getAllBook: builder.query<
      IResponse<IBook[]>,
      Record<string, unknown> | void
    >({
      query: (params) => ({
        url: "/book/all-books",
        method: "GET",
        params: params,
      }),
      providesTags: ["BOOK"],
    }),

    // get book by genre limit with 10
    getBookByGenre: builder.query<
      IResponse<IBook[]>,
      { genre: string; limit: number }
    >({
      query: ({ genre, limit = 10 }) => ({
        url: `/book/all-books?genre=${genre}&limit=${limit}`,
        method: "GET",
      }),
    }),

    // get single book
    getSingleBook: builder.query<IResponse<IBook>, string>({
      query: (slug) => ({
        url: `/book/${slug}`,
        method: "GET",
      }),
    }),

    // delete a book
    deleteSingleBook: builder.mutation({
      query: (id) => ({
        url: `/book/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["BOOK"],
    }),
  }),
});

export const {
  useGetAllBookQuery,
  useGetBookByGenreQuery,
  useAddNewBookMutation,
  useGetSingleBookQuery,
  useDeleteSingleBookMutation,
} = bookApi;
