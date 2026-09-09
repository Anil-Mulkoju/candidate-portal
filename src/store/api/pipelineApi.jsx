import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";

export const pipelineApi = createApi({
  reducerPath: "pipelineApi",
  baseQuery: baseQueryWithReauth,

  tagTypes: [
    "Pipeline",
    "CandidateDetail",
    "CandidateResume",
  ],

  endpoints: (builder) => ({
    // =====================================================
    // Candidate Resume
    // =====================================================
    getCandidateResume: builder.query({
      query: (candidateId) =>
        `/get_matched_candidates_details/${candidateId}`,

      transformResponse: (response) =>
        response?.success
          ? response.data
          : null,

      providesTags: (result, error, candidateId) => [
        {
          type: "CandidateResume",
          id: candidateId,
        },
      ],
    }),

  }),
});

export const {
  useGetPipelineCandidatesQuery,
  useLazyGetPipelineCandidatesQuery,

  useGetCandidateResumeQuery,
  useLazyGetCandidateResumeQuery,
} = pipelineApi;