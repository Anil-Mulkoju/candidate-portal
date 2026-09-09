import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../baseQuery";

export const userManagementService = createApi({
  reducerPath: "userManagementService",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Employees", "Availability"],

  endpoints: (builder) => ({
    // Employee List
    getEmployeesInSameOrg: builder.query({
      query: () => ({
        url: "/get_employees_in_same_org",
        method: "GET",
      }),
      providesTags: ["Employees"],
    }),

    // Roles Dropdown
    getRolesDropdown: builder.query({
      query: () => ({
        url: "/roles/dropdown",
        method: "GET",
      }),
    }),

    // Timezones
    getTimezones: builder.query({
      query: () => ({
        url: "/by-country",
        method: "GET",
      }),
    }),

    // Employee Availability
    getEmployeeAvailability: builder.query({
      query: (employeeId) => ({
        url: `/employee/availability/${employeeId}`,
        method: "GET",
      }),
      providesTags: (result, error, employeeId) => [
        { type: "Availability", id: employeeId },
      ],
    }),

    // HM/Admin Update
    updateEmployeeProfileDetails: builder.mutation({
      query: (body) => ({
        url: "/update_employee_profile_details",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Employees"],
    }),

    // Super Admin Update
    updateEmployeeProfileDetailsBySuperAdmin: builder.mutation({
      query: (body) => ({
        url: "/update_employee_profile_details_by_superadmin",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Employees"],
    }),
  }),
});

export const {
  useGetEmployeesInSameOrgQuery,
  useGetRolesDropdownQuery,
  useGetTimezonesQuery,
  useLazyGetEmployeeAvailabilityQuery,
  useUpdateEmployeeProfileDetailsMutation,
  useUpdateEmployeeProfileDetailsBySuperAdminMutation,
} = userManagementService;