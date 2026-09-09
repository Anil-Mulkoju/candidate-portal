import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../baseQuery";

export const myProfileService = createApi({
  reducerPath: "myProfileService",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["UserProfile", "Availability"],

  endpoints: (builder) => ({
    getEmployeeProfileDetails: builder.query({
      query: () => ({
        url: "/get_employee_profile_details",
        method: "GET",
      }),
      providesTags: ["UserProfile"],
    }),

    updateEmployeeProfileDetails: builder.mutation({
      query: (body) => ({
        url: "/update_employee_profile_details",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["UserProfile"],
    }),

    getRolesDropdown: builder.query({
      query: () => ({
        url: "/roles/dropdown",
        method: "GET",
      }),
    }),

    getTimezones: builder.query({
      query: () => ({
        url: "/by-country",
        method: "GET",
      }),
    }),

    getEmployeeAvailability: builder.query({
      query: (employeeId) => ({
        url: `/employee/availability/${employeeId}`,
        method: "GET",
      }),
      providesTags: ["Availability"],
    }),

    updateEmployeeAvailability: builder.mutation({
      query: ({ employeeId, body }) => ({
        url: `/employee/availability/${employeeId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Availability"],
    }),
  }),
});

export const {
  useGetEmployeeProfileDetailsQuery,
  useUpdateEmployeeProfileDetailsMutation,
  useGetRolesDropdownQuery,
  useGetTimezonesQuery,
  useLazyGetEmployeeAvailabilityQuery,
  useUpdateEmployeeAvailabilityMutation,
} = myProfileService;