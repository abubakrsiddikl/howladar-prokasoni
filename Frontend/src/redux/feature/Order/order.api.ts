import { baseApi } from "@/redux/baseApi";
import type { ICreateOrderPayload, IOrder, IResponse } from "@/types";

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    //  Create Order
    createOrder: builder.mutation<IResponse<IOrder>, ICreateOrderPayload>({
      query: (orderInfo) => ({
        url: "/order/create",
        method: "POST",
        data: orderInfo,
      }),
      invalidatesTags: ["ORDER"],
    }),

    //  Get My Orders
    getMyOrder: builder.query<IOrder[], void>({
      query: () => ({
        url: "/order/my-order",
        method: "GET",
      }),
      providesTags: ["ORDER"],
      transformResponse: (res: IResponse<IOrder[]>) => res.data,
    }),

    // Get Single Order
    getSingleOrder: builder.query<IOrder, string>({
      query: (orderId) => ({
        url: `/order/${orderId}`,
        method: "GET",
      }),
      transformResponse: (res: IResponse<IOrder>) => res.data,
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetMyOrderQuery,
  useGetSingleOrderQuery,
} = orderApi;
