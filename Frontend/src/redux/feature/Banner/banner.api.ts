import type {
  IBanner,
  IBannerCreatePayload,
  IBannerUpdatePayload,
  IResponse,
} from "@/types";

import { baseApi } from "@/redux/baseApi";

export const bannerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createBanner: builder.mutation<IResponse<IBannerCreatePayload>, FormData>({
      query: (payload) => ({
        url: `/banner/create`,
        method: "POST",
        data: payload,
      }),
      invalidatesTags: ["BANNER"],
    }),

    // get All Banner
    getAllBanner: builder.query<
      IResponse<IBanner[]>,
      Record<string, unknown> | void
    >({
      query: () => ({
        url: "/banner/all-banners",
        method: "GET",
      }),
      providesTags: ["BANNER"],
    }),

    // get single
    getSingleBanner: builder.query<IResponse<IBanner>, string>({
      query: (id) => ({
        url: `/banner/${id}`,
        method: "GET",
      }),
    }),

    // update
    updateBanner: builder.mutation<
      IResponse<IBannerUpdatePayload>,
      { id: string; payload: FormData }
    >({
      query: ({ id, payload }) => ({
        url: `/banner/update/${id}`,
        method: "PATCH",
        data: payload,
      }),
      invalidatesTags: ["BANNER"],
    }),

    // delete
    deleteBanner: builder.mutation<IResponse<null>, string>({
      query: (id: string) => ({
        url: `/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["BANNER"],
    }),
  }),
});

export const {
  useCreateBannerMutation,
  useDeleteBannerMutation,
  useUpdateBannerMutation,
  useGetAllBannerQuery,
  useGetSingleBannerQuery,
} = bannerApi;
