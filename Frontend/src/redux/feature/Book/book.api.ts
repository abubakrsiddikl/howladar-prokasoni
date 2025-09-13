
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
      { genre: string; page?: number; limit: number }
    >({
      query: ({ genre, page, limit = 10 }) => ({
        url: `/book/all-books?genre=${genre}&page=${page}&limit=${limit}`,
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

    // update book
    updateBook: builder.mutation<
      IResponse<IBook>,
      { id: string; formData: FormData }
    >({
      query: ({ id, formData }) => ({
        url: `/book/update/${id}`,
        method: "PATCH",
        data: formData,
      }),
      invalidatesTags: ["BOOK"],
    }),

    // delete a book
    deleteSingleBook: builder.mutation({
      query: (id) => ({
        url: `/book/delete/${id}`,
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
  useUpdateBookMutation,
  useDeleteSingleBookMutation,
} = bookApi;
