import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../baseQuery";

export const departmentService = createApi({
  reducerPath: "departmentService",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Departments"],

  endpoints: (builder) => ({
    // Get All Departments
    getDepartments: builder.query({
      query: () => ({
        url: "/auth/organisation/departments",
        method: "GET",
      }),
      providesTags: ["Departments"],
    }),

    // Create Department
    createDepartment: builder.mutation({
      query: (body) => ({
        url: "/auth/organisation/create_department",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Departments"],
    }),

    // Update Department
    updateDepartment: builder.mutation({
      query: ({ departmentId, body }) => ({
        url: `/auth/organisation/departments/${departmentId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Departments"],
    }),
  }),
});

export const {
  useGetDepartmentsQuery,
  useLazyGetDepartmentsQuery,
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
} = departmentService;