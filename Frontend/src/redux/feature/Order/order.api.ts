import { baseApi } from "@/redux/baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (orderInfo) => ({
        url: "/order/create",
        method: "POST",
        data: orderInfo,
      }),
    }),

    getMyOrder: builder.query({
      query: () => ({
        url: "/order/my-order",
        method: "GET",
      }),
      transformResponse: (res) => res?.data ?? res,
    }),
    getSingleOrder: builder.query({
      query: (orderId) => ({
        url: `/order/${orderId}`,
        method: "GET",
      }),
      transformResponse: (res) => res?.data ?? res,
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetMyOrderQuery,
  useGetSingleOrderQuery,
} = authApi;
