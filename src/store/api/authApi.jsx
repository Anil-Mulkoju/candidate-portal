import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ACCESS_TOKEN, REFRESH_TOKEN, setItem, USER_DATA } from "../../utils/helper";

// const BASE_URL = import.meta.env.VITE_BASE_URL;

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_BASE_URL || import.meta.env.REACT_APP_BASE_URL || "",
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("accessToken");

            if (token) {
                headers.set("authorization", `Bearer ${token}`);
            }

            return headers;
        },
    }),


    endpoints: (builder) => ({
        login: builder.mutation({
            query: ({ username, password }) => {
                const formData = new URLSearchParams();

                formData.append("username", username);
                formData.append("password", password);

                return {
                    url: "/auth/login",
                    method: "POST",
                    body: formData,
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                };
            },
        }),
        register: builder.mutation({
            query: (payload) => ({
                url: "/auth/superadmin_signup",
                method: "POST",
                body: payload,
            }),
        }),
        // src/redux/services/authApi.js

        verifyOtp: builder.mutation({
            query: (payload) => ({
                url: "/auth/superadmin_confirm_email",
                method: "POST",
                body: payload,
            }),
        }),

        resendOtp: builder.mutation({
            query: (payload) => ({
                url: "/auth/super_admin_resend_otp",
                method: "POST",
                body: payload,
            }),
        }),
        getCountries: builder.query({
            query: () => "/dropdown/countries",
        }),

        getIndustries: builder.query({
            query: () => "/Industry/",
        }),

        getTimezones: builder.query({
            query: (country) => ({
                url: "/by-country",
                params: { country },
            }),
        }),

        createOrganisation: builder.mutation({
            query: (body) => ({
                url: "/auth/create_superadmin_organisation",
                method: "POST",
                body,
            }),
        }),
    }),
});

export const {
    useLoginMutation,
    useRegisterMutation,
    useVerifyOtpMutation,
    useResendOtpMutation,
    useGetCountriesQuery,
    useGetIndustriesQuery,
    useGetTimezonesQuery,
    useCreateOrganisationMutation,
} = authApi;