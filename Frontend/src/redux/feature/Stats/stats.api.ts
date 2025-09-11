import { baseApi } from "@/redux/baseApi";
import type { IMonthlyStats, IResponse, IStats } from "@/types";

export const statsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // get all stats
    getAllStats: builder.query<
      IResponse<IStats>,
      Record<string, unknown> | void
    >({
      query: () => ({
        url: "/stats",
        method: "GET",
      }),
      providesTags: ["STATS"],
    }),

    // get all stats
    getMonthlyStats: builder.query<
      IResponse<IMonthlyStats[]>,
      Record<string, unknown> | void
    >({
      query: () => ({
        url: "/stats/monthly-sales",
        method: "GET",
      }),
      providesTags: ["STATS"],
    }),
  }),
});

export const { useGetAllStatsQuery, useGetMonthlyStatsQuery } = statsApi;
