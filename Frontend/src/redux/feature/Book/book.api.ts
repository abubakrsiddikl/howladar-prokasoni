import { baseApi } from "@/redux/baseApi";

const bookApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllBook: builder.query({
      query: () => ({
        url: "/book/all-books",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetAllBookQuery } = bookApi;
