import { baseApi } from "@/redux/baseApi";
import type {
  ICreateOrderPayload,
  IOrder,
  IResponse,
} from "@/types";

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

    // get all orders
    getAllOrder: builder.query<IOrder[], void>({
      query: () => ({
        url: "/order/all-order",
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

    // get order trace
    getTrackOrder: builder.query<IOrder, string>({
      query: (orderId) => ({
        url: `/order/${orderId}/trace`,
        method: "GET",
      }),
      transformResponse: (res: IResponse<IOrder>) => res.data,
    }),

    // update order status by admin and store-manager
    //  Create Order
    updateOrderStatus: builder.mutation<
      IResponse<IOrder>,
      { id: string; status: string }
    >({
      query: ({ id, status }) => ({
        url: `/order/${id}/status`,
        method: "PATCH",
        data: { status },
      }),
      invalidatesTags: ["ORDER"],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetMyOrderQuery,
  useGetSingleOrderQuery,
  useGetAllOrderQuery,
  useGetTrackOrderQuery,
  useUpdateOrderStatusMutation,
} = orderApi;
