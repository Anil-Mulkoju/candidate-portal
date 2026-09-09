// ─────────────────────────────────────────────────────────────────────────────
// redux/api/candidatesApi.js
// RTK Query endpoints for Matched Candidates page
// ─────────────────────────────────────────────────────────────────────────────
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";

export const candidatesApi = createApi({
  reducerPath: "candidatesApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Candidates", "AccountManagers"],

  endpoints: (builder) => ({

    // ── Matching candidates for a job ───────────────────────────────────────
    getMatchingCandidates: builder.query({
      query: (jobDetailsId) => ({
        url: `/get_matching_candidates/${jobDetailsId}`,
        method: "POST",
        body: { job_details_id: jobDetailsId },
      }),
      transformResponse: (response) => {
        // Other callers (DashboardAiAssistant, ScanningPage) expect the
        // resolved data to be the plain candidates array, so the job/
        // no_of_positions/rejected_candidates fields the API now also
        // returns are attached onto that same array rather than wrapping
        // it in an object — it's still a real array (Array.isArray, .map,
        // .filter all work as before), just with a few extra named props.
        if (!response?.success) return [];
        const candidates = Array.isArray(response.data) ? response.data : [];
        candidates.job = response.job || null;
        candidates.no_of_positions = response.no_of_positions ?? null;
        candidates.rejected_candidates = response.rejected_candidates ?? null;
        return candidates;
      },
      providesTags: (result, error, jobDetailsId) => [
        { type: "Candidates", id: jobDetailsId },
      ],
    }),

    // ── Single candidate detail ─────────────────────────────────────────────
    getCandidateDetails: builder.query({
      query: (candidateId) => `/get_matched_candidates_details/${candidateId}`,
    }),

    // ── Employer candidate list and matched jobs ───────────────────────────
    getEmployerCandidates: builder.query({
      query: () => "/my-jobs/candidates",
      transformResponse: (response) => response?.data || [],
    }),

    getEmployerCandidateJobs: builder.query({
      query: (candidateId) => `/my-jobs/candidates/${candidateId}`,
      transformResponse: (response) => response?.data?.jobs || [],
    }),

    // ── Account managers ────────────────────────────────────────────────────
    getAccountManagers: builder.query({
      query: () => "/organisation/account-managers",
      providesTags: ["AccountManagers"],
    }),

 getResumeByCandidateId: builder.query({
  query: (candidateId) => `/resume_view_by_input/?candidate_id=${candidateId}`,
  transformResponse: (res) => {
    if (res?.success && res?.resume_url) return res.resume_url;
    throw new Error("Resume not found");
  },
}),
    // ── Request more candidates ─────────────────────────────────────────────
    requestMoreCandidates: builder.mutation({
      query: ({ jobId, exactNoOfPositions, assignTo }) => ({
        url: "/request-more-candidates",
        method: "POST",
        body: {
          job_id: jobId,
          exact_no_of_positions: exactNoOfPositions,
          assign_to: assignTo,
        },
      }),
    }),

    // ── Update Candidate Status (NEW) ───────────────────────────────────────
    updateCandidateStatus: builder.mutation({
      query: ({ candidateId, newStatus, reason = "" }) => ({
        url: "/matched_candidates/update_status_v1",
        method: "POST",
        params: {
          candidate_id: candidateId,
          new_status: newStatus,
          reason: reason,
        },
      }),
      invalidatesTags: ["Candidates"],
    }),

    // ── Hold / Reopen a candidate on the pipeline ───────────────────────────
    holdCandidate: builder.mutation({
      query: ({ matchedCandidateId, reason }) => ({
        url: `/matched_candidates/${matchedCandidateId}/hold`,
        method: "POST",
        body: { reason },
      }),
      invalidatesTags: ["Candidates"],
    }),

    reopenCandidate: builder.mutation({
      query: (matchedCandidateId) => ({
        url: `/matched_candidates/${matchedCandidateId}/reopen`,
        method: "POST",
      }),
      invalidatesTags: ["Candidates"],
    }),

    getCandidateDetailsById: builder.query({
      query: (candidateId) => `/get_matched_candidates_details/${candidateId}`,
      transformResponse: (response) => response?.data || response,
    }),

    // ── Get Three Matched Candidates ───────────────────────────────────────
    getThreeMatchedCandidates: builder.query({
      query: (jobDetailsId) => `/get_three_matched_candidates/${jobDetailsId}`,
      transformResponse: (response) => {
        if (Array.isArray(response?.data)) return response.data;
        if (Array.isArray(response?.candidates)) return response.candidates;
        if (Array.isArray(response)) return response;
        return [];
      },
      providesTags: (result, error, jobDetailsId) => [
        { type: "Candidates", id: jobDetailsId || "LIST" },
      ],
    }),
  }),
});

export const {
  useGetMatchingCandidatesQuery,
  useLazyGetMatchingCandidatesQuery,
  useLazyGetCandidateDetailsQuery,
  useGetEmployerCandidatesQuery,
  useLazyGetEmployerCandidateJobsQuery,
  useGetAccountManagersQuery,
  useRequestMoreCandidatesMutation,
  useUpdateCandidateStatusMutation,
  useHoldCandidateMutation,
  useReopenCandidateMutation,
  useGetThreeMatchedCandidatesQuery,
  useLazyGetCandidateDetailsByIdQuery,
   useGetResumeByCandidateIdQuery,
  useLazyGetResumeByCandidateIdQuery,
} = candidatesApi;