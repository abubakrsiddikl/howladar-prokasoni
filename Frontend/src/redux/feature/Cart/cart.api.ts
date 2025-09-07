import { baseApi } from "@/redux/baseApi";
import type { IResponse, ICartItem } from "@/types";

export const cartApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get my cart
    getMyCart: builder.query<ICartItem[], void>({
      query: () => ({
        url: "/cart/my-cart",
        method: "GET",
      }),
      providesTags: ["CART"],
      transformResponse: (res: IResponse<ICartItem[]>) => res.data,
    }),

    // Add to cart
    addToCart: builder.mutation<
      IResponse<ICartItem>,
      { bookId: string; quantity: number }
    >({
      query: (body) => ({
        url: "/cart/add",
        method: "POST",
        data: body, // ❌ data না, fetchBaseQuery তে body দিতে হয়
      }),
      invalidatesTags: ["CART"],
    }),

    // Remove item from cart
    removeFromCart: builder.mutation<IResponse<null>, string>({
      query: (cartItemId) => ({
        url: `/cart/remove/${cartItemId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["CART"],
    }),

    //  Update cart quantity
    updateCartQuantity: builder.mutation<
      IResponse<ICartItem>,
      { id: string; quantity: number }
    >({
      query: ({ id, quantity }) => ({
        url: `/cart/update/${id}`,
        method: "PATCH",
        data: { quantity }, 
      }),
      invalidatesTags: ["CART"],
    }),

    //  Clear all cart
    clearCart: builder.mutation<IResponse<null>, void>({
      query: () => ({
        url: "/cart/clear",
        method: "DELETE",
      }),
      invalidatesTags: ["CART"],
    }),

    //  Merge cart after login
    mergeCart: builder.mutation<
      IResponse<ICartItem[]>,
      { items: { book: string; quantity: number }[] }
    >({
      query: (body) => ({
        url: "/cart/merge",
        method: "POST",
        data: body,
      }),
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
