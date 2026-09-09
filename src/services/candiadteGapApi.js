// candidateGapAnalysisApi.js
//
// Uses RTK Query on top of your existing `candidateApi` axios instance
// (services/candidateApi.js) instead of fetchBaseQuery. That instance
// already attaches the Authorization header and handles 401 refresh-token
// retry via interceptors — a plain fetchBaseQuery would bypass all of that
// and would need its own copy of the refresh logic to behave the same way
// on an expired token. Wrapping axios in a small custom baseQuery lets
// RTK Query's caching/hooks sit on top of the interceptor behavior you
// already have, instead of re-implementing it.

import { createApi } from "@reduxjs/toolkit/query/react";
import candidateApi from "./candidateApi.js"; // adjust to match this file's actual location relative to services/candidateApi.js

/**
 * Adapts the shared axios instance to RTK Query's baseQuery signature.
 * Endpoints call `query: () => ({ url, method, data, params })` exactly
 * like fetchBaseQuery — the only difference is requests are routed
 * through axios (and therefore through your interceptors) underneath.
 */
const axiosBaseQuery =
  (axiosInstance) =>
  async ({ url, method = "GET", data, params }) => {
    try {
      const result = await axiosInstance({ url, method, data, params });
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError;
      return {
        error: {
          status: err?.response?.status,
          data: err?.response?.data || err?.message || "Request failed",
        },
      };
    }
  };

export const candidateGapAnalysisApi = createApi({
  reducerPath: "candidateGapAnalysisApi",
  baseQuery: axiosBaseQuery(candidateApi),
  tagTypes: ["CandidateSkills"],
  endpoints: (builder) => ({
    getCandidateSkills: builder.query({
      query: () => ({
        url: "/get_candidate_skills/skills",
        method: "GET",
      }),
      providesTags: ["CandidateSkills"],
    }),
  }),
});

export const { useGetCandidateSkillsQuery, useLazyGetCandidateSkillsQuery } =
  candidateGapAnalysisApi;

export default candidateGapAnalysisApi;

/* ── Register with your store (only needed if this stays standalone) ──
import { candidateGapAnalysisApi } from ".../candidateGapAnalysisApi";

export const store = configureStore({
  reducer: {
    ...otherReducers,
    [candidateGapAnalysisApi.reducerPath]: candidateGapAnalysisApi.reducer,
  },
  middleware: (getDefault) =>
    getDefault().concat(candidateGapAnalysisApi.middleware),
});
*/

/* ── OR, better: if CandidatePortalApis.js (the slice your other pages
   already use, e.g. useAddCandidateEmploymentMutation) is ALSO built on
   an axiosBaseQuery wrapping this same candidateApi instance, just add
   this as an injected endpoint there instead — no second reducer, no
   second store registration, same cache as your other candidate calls:

getCandidateSkills: builder.query({
  query: () => ({ url: "/get_candidate_skills/skills", method: "GET" }),
}),
*/