import { baseApi } from "@/redux/baseApi";

const bookApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllBook: builder.query({
      query: (params) => ({
        url: "/book/all-books",
        method: "GET",
        params: params,
      }),
    }),
    getBookByGenre: builder.query({
      query: (genre) => ({
        url: `/book/genre/${genre}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetAllBookQuery, useGetBookByGenreQuery } = bookApi;
