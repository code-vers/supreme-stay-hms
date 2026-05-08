import { base_url } from "@/utils/utils";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const bookingApi = createApi({
  reducerPath: "bookingApi",

  baseQuery: fetchBaseQuery({
    baseUrl: `${base_url}/bookings`,
    prepareHeaders: (headers) => {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("access_token="))
        ?.split("=")[1];

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),

  endpoints: (builder) => ({
    // Get all bookings (for property owner)
    getAllBookings: builder.query({
      query: (params) => ({
        url: "/",
        params,
      }),
    }),

    // Get hotel booking report (stats, charts)
    getHotelBookingReport: builder.query({
      query: (hotelId: string) => `/report/${hotelId}`,
    }),

    // Get a single booking
    getBookingById: builder.query({
      query: (id: string) => `/${id}`,
    }),
  }),
});

export const {
  useGetAllBookingsQuery,
  useGetHotelBookingReportQuery,
  useGetBookingByIdQuery,
} = bookingApi;
