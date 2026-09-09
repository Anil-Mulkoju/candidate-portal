// candidateJobsApi.js
//
// Same axiosBaseQuery-over-candidateApi pattern as candidateGapAnalysisApi.js
// (see that file's header comment for why: reuses your interceptor's auth
// header + 401 refresh-retry logic instead of duplicating it).
//
// Endpoint: GET /candidate/matched-jobs/bycountry?min_score=<n>&country=<c>

import { createApi } from "@reduxjs/toolkit/query/react";
import candidateApi from "./candidateApi"; // adjust to match this file's actual location relative to services/candidateApi.js

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

export const candidateJobsApi = createApi({
  reducerPath: "candidateJobsApi",
  baseQuery: axiosBaseQuery(candidateApi),
  tagTypes: ["MatchedJobs"],
  endpoints: (builder) => ({
    // country is passed lowercase to match the curl example (?country=india)
    getMatchedJobsByCountry: builder.query({
      query: ({ country, minScore = 60 } = {}) => ({
        url: "/candidate/matched-jobs/bycountry",
        method: "GET",
        params: {
          country: (country || "").toLowerCase(),
          // min_score: minScore,
        },
      }),
      providesTags: ["MatchedJobs"],
    }),
  }),
});

export const {
  useGetMatchedJobsByCountryQuery,
  useLazyGetMatchedJobsByCountryQuery,
} = candidateJobsApi;

export default candidateJobsApi;

/* ── Register with your store (only needed if this stays standalone) ──
import { candidateJobsApi } from ".../candidateJobsApi";

export const store = configureStore({
  reducer: {
    ...otherReducers,
    [candidateJobsApi.reducerPath]: candidateJobsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(...yourExistingApiMiddlewares) // whatever you already concat
      .concat(candidateJobsApi.middleware),
});

Same caveat as candidateGapAnalysisApi.js: if CandidatePortalApis.js is also
built on an axiosBaseQuery wrapping this same candidateApi instance, prefer
adding getMatchedJobsByCountry as an injected endpoint there instead — one
shared cache, and this store.js file doesn't need to change at all.
*/