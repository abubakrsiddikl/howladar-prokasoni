import { baseApi } from "@/redux/baseApi";

const bookApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllBook: builder.query({
      query: () => ({
        url: "/book/all-books",
        method: "GET",
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
