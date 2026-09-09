import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../baseQuery.jsx";

export const organisationService = createApi({
  reducerPath: "organisationService",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Organization"],

  endpoints: (builder) => ({
    getOrganizationDetails: builder.query({
      query: () => ({
        url: "/organisation/details",
        method: "GET",
      }),
      providesTags: ["Organization"],
    }),

    updateOrganizationDetails: builder.mutation({
      query: (body) => ({
        url: "/update_organisation",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Organization"],
    }),

    getCountries: builder.query({
      query: () => ({
        url: "/dropdown/countries",
        method: "GET",
      }),
    }),

    getTimezonesByCountry: builder.query({
      query: (country) => ({
        url: "/by-country",
        method: "GET",
        params: { country },
      }),
    }),
  }),
});

export const {
  useGetOrganizationDetailsQuery,
  useUpdateOrganizationDetailsMutation,
  useGetCountriesQuery,
  useLazyGetTimezonesByCountryQuery,
} = organisationService;