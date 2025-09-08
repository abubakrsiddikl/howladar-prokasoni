import { baseApi } from "@/redux/baseApi";
import type { IGenre, IResponse } from "@/types";

export const genreApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create Genre
    createGenre: builder.mutation<IResponse<IGenre>, Partial<IGenre>>({
      query: (data) => ({
        url: "/genre/create",
        method: "POST",
        data: data,
      }),
      invalidatesTags: ["GENRE"],
    }),

    // Get All Genres
    getAllGenres: builder.query<IResponse<IGenre[]>, void>({
      query: () => ({
        url: "/genre",
        method: "GET",
      }),
      providesTags: ["GENRE"],
    }),

    // Get Single Genre by Slug
    getGenreBySlug: builder.query<IResponse<IGenre>, string>({
      query: (slug) => ({
        url: `/genre/${slug}`,
        method: "GET",
      }),
      providesTags: ["GENRE"],
    }),

    // Update Genre
    updateGenre: builder.mutation<
      IResponse<IGenre>,
      { slug: string; data: Partial<IGenre> }
    >({
      query: ({ slug, data }) => ({
        url: `/genres/${slug}`,
        method: "PATCH",
        data: data,
      }),
      invalidatesTags: ["GENRE"],
    }),

    // Delete Genre
    deleteGenre: builder.mutation<IResponse<IGenre>, string>({
      query: (slug) => ({
        url: `/genre/${slug}`,
        method: "DELETE",
      }),
      invalidatesTags: ["GENRE"],
    }),
  }),
});

export const {
  useCreateGenreMutation,
  useGetAllGenresQuery,
  useGetGenreBySlugQuery,
  useUpdateGenreMutation,
  useDeleteGenreMutation,
} = genreApi;
