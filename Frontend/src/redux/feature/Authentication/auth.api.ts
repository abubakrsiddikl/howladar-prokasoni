import { baseApi } from "@/redux/baseApi";
import type { IResponse, IUser } from "@/types";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (userInfo) => ({
        url: "/user/register",
        method: "POST",
        data: userInfo,
      }),
    }),
    // login
    login: builder.mutation({
      query: (userInfo) => ({
        url: "/auth/login",
        method: "POSt",
        data: userInfo,
      }),
    }),
    // get profile
    userProfile: builder.query<IResponse<IUser>, void>({
      query: () => ({
        url: "/user/me",
        method: "GET",
      }),
    }),
    // logout
    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useUserProfileQuery,
  useLogoutMutation,
} = authApi;
