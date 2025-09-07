import { baseApi } from "@/redux/baseApi";
import type { IBook, IBookCreate, IResponse } from "@/types";

const bookApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addNewBook: builder.mutation<IResponse<IBookCreate>, FormData>({
      query: (payload) => ({
        url: "/book/create",
        method: "POST",
        data: payload,
      }),
      invalidatesTags: ["BOOK"],
    }),
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
    getBookByGenre: builder.query<IResponse<IBook[]>, string>({
      query: (genre) => ({
        url: `/book/genre/${genre}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetAllBookQuery,
  useGetBookByGenreQuery,
  useAddNewBookMutation,
} = bookApi;
