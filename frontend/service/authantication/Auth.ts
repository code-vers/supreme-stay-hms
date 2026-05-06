import { userRegister } from "@/type/RegisterType";
import { base_url } from "@/utils/utils";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// 👉 Helper: save token in cookie
const setTokenCookie = (token: string) => {
  document.cookie = `access_token=${token}; path=/; max-age=604800`; // 7 days
};

export const logoutUser = () => {
  document.cookie = "access_token=; path=/; max-age=0";
};

export const authApi = createApi({
  reducerPath: "authApi",

  baseQuery: fetchBaseQuery({
    baseUrl: `${base_url}/auth`,
  }),

  endpoints: (builder) => ({
    // ================= REGISTER =================
    userRegister: builder.mutation({
      query: (data: userRegister) => ({
        url: "/register",
        method: "POST",
        body: data,
      }),
    }),

    // ================= LOGIN =================
    userLogin: builder.mutation({
      query: (data: { email: string; password: string }) => ({
        url: "/login",
        method: "POST",
        body: data,
      }),

      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const result = await queryFulfilled;

          const token = result.data?.data?.access_token;

          if (token) {
            setTokenCookie(token); //  store token in cookie
          }
        } catch (error) {
          console.log("Login failed:", error);
        }
      },
    }),

    // forget password
    forgetPassword: builder.mutation({
      query: (email: string) => ({
        url: "/forgot-password",
        method: "POST",
        body: { email },
      }),
    }),

    passwordReset: builder.mutation({
      query: (data: { token: string; password: string }) => ({
        url: "/reset-password",
        method: "POST",
        body: data,
      }),
    }),

    getRoles: builder.query({
      query: () => "/roles",
    }),
  }),
});

// ================= EXPORT HOOKS =================
export const {
  useUserRegisterMutation,
  useUserLoginMutation,
  useForgetPasswordMutation,
  usePasswordResetMutation,
  useGetRolesQuery,
} = authApi;
