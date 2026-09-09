import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";

export const interviewApi = createApi({
  reducerPath: "interviewApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Interviews", "InterviewDetails", "InterviewFeedback"],
  
  endpoints: (builder) => ({
    getInterviewsList: builder.query({
      query: () => "/interviews/list-of_interviews",
      transformResponse: (response) => {
        if (response?.success && Array.isArray(response.data)) return response.data;
        return [];
      },
      providesTags: ["Interviews"],
    }),

    getInterviewDetails: builder.query({
      query: (id) => `/interviews_details/${id}`,
      providesTags: (result, error, id) => [{ type: "InterviewDetails", id }],
    }),

    getInterviewFeedback: builder.query({
      query: (interviewId) => `/interview/${interviewId}/feedback_v1`,
      providesTags: (result, error, interviewId) => [{ type: "InterviewFeedback", id: interviewId }],
    }),

    submitInterviewFeedback: builder.mutation({
      query: (body) => ({
        url: "/interview/feedback_v1",
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, arg) => [{ type: "InterviewFeedback", id: arg.interview_id }],
    }),

    updateInterviewStatus: builder.mutation({
      query: ({ interviewId, newStatus, result, reason }) => {
        const params = new URLSearchParams();
        if (newStatus) params.append("new_status", newStatus);
        if (result) params.append("result", result);
        if (reason) params.append("reason", reason);
        return {
          url: `/interviews/${interviewId}/status_v1?${params.toString()}`,
          method: "PUT",
        };
      },
      invalidatesTags: (result, error, arg) => [
        { type: "InterviewDetails", id: arg.interviewId },
        "Interviews",
      ],
    }),

    getMatchedCandidateDetails: builder.query({
      query: (candidateId) => `/get_matched_candidates_details/${candidateId}`,
    }),

    getInterviewersByRole: builder.query({
      async queryFn(_arg, _api, _extra, baseQuery) {
        const roles = ["super_admin", "hm_user", "admin", "interview_user"];
        const results = await Promise.all(
          roles.map((role) =>
            baseQuery(`/user-employees/by-role_v1?user_role=${role}`)
          )
        );
        const allUsers = results.flatMap((r) => r.data?.data ?? []);
        const unique = [...new Map(allUsers.map((u) => [u.id, u])).values()];
        const interviewers = unique
  .filter((u) => u.id && u.name)
  .map((u) => ({
    id: u.id,
    name: u.name,
    role: u.role || u.department || "",
    timezone: u.timezone || "Asia/Kolkata",
    designation: u.designation || "",
  }))
  .sort((a, b) => a.name.localeCompare(b.name));
        return { data: interviewers };
      },
    }),

    getInterviewTypes: builder.query({
      query: () => "/interviewtype/",
      transformResponse: (res) => res || [],
    }),

    getTimezones: builder.query({
      query: () => "/by-country",
      transformResponse: (res) => {
        const list = Array.isArray(res) ? res : res?.data ?? [];
        return list
          .map((item) => ({ id: item.id, label: item.label, iana: item.key?.trim() }))
          .sort((a, b) => a.label.localeCompare(b.label));
      },
    }),

    getAvailableSlots: builder.query({
      query: ({ employeeId, duration, date }) =>
        `/employees/availability/slots/by-date?employee_ids=${employeeId}&slot_duration_minutes=${duration}&selected_date=${date}`,
      // Surface both lists rather than filtering blocked_slots out — the UI
      // still shows blocked slots (disabled, with a tooltip) instead of
      // hiding them outright, so recruiters can see a slot exists but is
      // already taken.
      transformResponse: (res) => ({
        available: Array.isArray(res?.available_slots) ? res.available_slots : [],
        blocked: Array.isArray(res?.blocked_slots) ? res.blocked_slots : [],
      }),
    }),

    scheduleInterview: builder.mutation({
      query: (payload) => ({
        url: "/schedule_interview",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Interviews"],
    }),

    updateInterview: builder.mutation({
      query: ({ interviewId, payload }) => ({
        url: `/interview/${interviewId}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "InterviewDetails", id: arg.interviewId },
        "Interviews",
      ],
    }),

  }),
});

export const {
  useGetInterviewsListQuery,
  useGetInterviewDetailsQuery,
  useLazyGetInterviewDetailsQuery,
  useGetInterviewFeedbackQuery,
  useLazyGetInterviewFeedbackQuery,
  useSubmitInterviewFeedbackMutation,
  useUpdateInterviewStatusMutation,
  useGetMatchedCandidateDetailsQuery,
  useLazyGetMatchedCandidateDetailsQuery,
  useGetInterviewersByRoleQuery,
  useGetInterviewTypesQuery,
  useGetTimezonesQuery,
  useLazyGetAvailableSlotsQuery,
  useScheduleInterviewMutation,
  useUpdateInterviewMutation,
} = interviewApi;