/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/redux/baseApi";
import type { CartItem } from "@/types";

export const cartApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // get my cart
    getMyCart: builder.query({
      query: () => ({
        url: "/cart/my-cart",
        method: "GET",
      }),
      providesTags: ["CART"],
      transformResponse: (res: any) => res?.data ?? res,
    }),

    // add to cart
    addToCart: builder.mutation({
      query: (body) => ({
        url: "/cart/add",
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["CART"],
    }),

    // remove cart to db
    removeFromCart: builder.mutation<void, string>({
      query: (cartItemId) => ({
        url: `/cart/remove/${cartItemId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["CART"],
    }),

    // update cart quantity
    updateCartQuantity: builder.mutation<
      void,
      { id: string; quantity: number }
    >({
      query: ({ id, quantity }) => ({
        url: `/cart/update/${id}`, // id কে param হিসেবে পাঠাও
        method: "PATCH",
        data: { quantity: quantity }, // ✅ Proper object পাঠাও
      }),
      invalidatesTags: ["CART"],
    }),

    // clear all cart for a user
    clearCart: builder.mutation<void, void>({
      query: () => ({ url: "/cart/clear", method: "DELETE" }),
      invalidatesTags: ["CART"],
    }),

    // merge cart after login to db
    mergeCart: builder.mutation<
      CartItem[],
      { items: { book: string; quantity: number }[] }
    >({
      query: (body) => ({ url: "/cart/merge", method: "POST", body }),
      invalidatesTags: ["CART"],
    }),
  }),
});

export const {
  useGetMyCartQuery,
  useAddToCartMutation,
  useRemoveFromCartMutation,
  useUpdateCartQuantityMutation,
  useClearCartMutation,
  useMergeCartMutation,
} = cartApi;
