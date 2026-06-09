import { base_url } from "@/utils/utils";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const hotelApi = createApi({
  reducerPath: "hotelApi",

  baseQuery: fetchBaseQuery({
    baseUrl: `${base_url}/hotels`,
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

  tagTypes: ["Hotels"],
  endpoints: (builder) => ({
    // Get all hotels (owned by the user)
    getOwnedHotels: builder.query({
      query: (params) => ({
        url: "/",
        params,
      }),
      providesTags: [{ type: "Hotels", id: "LIST" }],
    }),

    // Get a single hotel
    getHotelById: builder.query({
      query: (id: string) => `/${id}`,
      providesTags: (result, error, id) => [{ type: "Hotels", id }],
    }),

    // Create a new hotel
    createHotel: builder.mutation({
      query: (data) => ({
        url: "/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Hotels", id: "LIST" }],
    }),

    // Update a hotel
    updateHotel: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Hotels", id: "LIST" },
        { type: "Hotels", id },
      ],
    }),

    // Delete a hotel
    deleteHotel: builder.mutation({
      query: (id: string) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Hotels", id: "LIST" }],
    }),
  }),
});

export const {
  useGetOwnedHotelsQuery,
  useGetHotelByIdQuery,
  useCreateHotelMutation,
  useUpdateHotelMutation,
  useDeleteHotelMutation,
} = hotelApi;
