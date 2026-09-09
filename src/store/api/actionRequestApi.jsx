import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";
import { jobApi } from "./jobApi";

export const actionRequestApi = createApi({
  reducerPath: "actionRequestApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["ActionRequests"],

  endpoints: (builder) => ({
    // Super admin — every action request org-wide (theirs to review), with
    // requester_name/requester_designation on each item. Default "all" so
    // pending/approved/rejected can be filtered client-side from one
    // response instead of firing a separate request per status.
    getActionRequests: builder.query({
      query: (status = "all") => `/action-requests?status=${encodeURIComponent(status)}`,
      transformResponse: (response) =>
        response?.success && Array.isArray(response.data) ? response.data : [],
      providesTags: ["ActionRequests"],
    }),

    // HM user (and anyone else who isn't a reviewer) — only the requests
    // they personally submitted.
    getMyActionRequests: builder.query({
      query: (status = "all") => `/action-requests/my-requests?status=${encodeURIComponent(status)}`,
      transformResponse: (response) =>
        response?.success && Array.isArray(response.data) ? response.data : [],
      providesTags: ["ActionRequests"],
    }),

    reviewActionRequest: builder.mutation({
      query: ({ requestId, action, review_notes = "" }) => ({
        url: `/action-requests/${requestId}/review`,
        method: "POST",
        body: {
          action,
          review_notes,
        },
      }),
      invalidatesTags: ["ActionRequests"],
      async onQueryStarted(_payload, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // Reviewing a delete_job request removes/changes a job — refresh the jobs list too.
          dispatch(jobApi.util.invalidateTags(["Jobs"]));
        } catch {
          // no-op — error surfaced to the caller via the mutation's own promise
        }
      },
    }),
  }),
});

export const {
  useGetActionRequestsQuery,
  useGetMyActionRequestsQuery,
  useReviewActionRequestMutation,
} = actionRequestApi;
