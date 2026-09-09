import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";
import { dashboardApi } from "./dashboardApi";
import { candidatesApi } from "./CandidateApi";

// Job status/existence changes (delete, hold, reopen) also affect the
// Dashboard page's stats + job list — but those live in a separate RTK
// Query slice (dashboardApi) that this slice's own "Jobs" tag can't reach.
// Tag invalidation only ever reaches queries within the same createApi
// instance, so cross-slice updates need an explicit dispatch like this one.
const invalidateDashboardJobs = (dispatch) => {
  dispatch(dashboardApi.util.invalidateTags(["DashboardJobs"]));
};

export const jobApi = createApi({
  reducerPath: "jobApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Templates", "Jobs"],

  endpoints: (builder) => ({

    // ── Static / dropdown data ───────────────────────────────────────────────

    getCountries: builder.query({
      query: () => "/dropdown/countries",
    }),

    getLocationsByCountry: builder.query({
      query: (country) => `/dropdown/locations?country=${country}`,
    }),

    getWorkTypes: builder.query({
      query: (country) => `/work-types?country=${encodeURIComponent(country)}`,
    }),

    getWorkAuthorizations: builder.query({
      query: (country) => `/work-authorizations?country=${encodeURIComponent(country)}`,
    }),

    getEdcTools: builder.query({
      query: () => "/edc-tools",
    }),

    getTherapeuticAreas: builder.query({
      query: () => "/therapeutic-areas",
    }),

    getUsersByRole: builder.query({
      query: (role) => `/user-employees/by-role_v1?user_role=${role}`,
    }),

    // ── Clinical dropdown ────────────────────────────────────────────────────

    getClinicalSubFunctions: builder.query({
      query: (functionKey) => `/dropdown/${functionKey}`,
    }),

    // ── Skills ───────────────────────────────────────────────────────────────

    getPrimarySkills: builder.query({
      query: (subFunctionType) => `/skills/${subFunctionType}`,
      // subFunctionType: "statistical programmer" | "clinical data manager"
    }),

    getNormalSkills: builder.query({
      query: ({ subFunctionKey, mode }) => {
        if (subFunctionKey === "clinical programmer/crf developer") {
          return `/raveprogrammer/skills${mode ? `?mode=${mode}` : ""}`;
        }
        return `/normal_skill/by-sub_function?sub_function=${subFunctionKey}`;
      },
    }),

    getMandatorySkills: builder.query({
      query: ({ subFunctionKey, primaryCsv = "" }) =>
        `/mandatory_skill/by-primary?sub_function=${subFunctionKey}&primary_selected=${primaryCsv}`,
    }),

    getSecondarySkills: builder.mutation({
      query: ({ subFunctionKey, primaryCsv = "", mandatoryCsv = "" }) => ({
        url: `/secondary_skill/by-mandatory?sub_function=${subFunctionKey}&primary_selected=${primaryCsv}&mandatory_selected=${mandatoryCsv}`,
        method: "POST",
      }),
    }),

    getRaveProgrammerSkills: builder.query({
      query: (mode) =>
        mode ? `/raveprogrammer/skills?mode=${mode}` : "/raveprogrammer/skills",
    }),

    getRaveProgrammerSecondarySkills: builder.mutation({
      query: (selectedSkillKeys) => ({
        url: "/raveprogrammerskills/remaining",
        method: "POST",
        body: { selected_skill_keys: selectedSkillKeys },
      }),
    }),

    // ── Templates ────────────────────────────────────────────────────────────

    getTemplates: builder.query({
      query: () => "/job-templates",
      providesTags: ["Templates"],
    }),

    deleteTemplate: builder.mutation({
      query: (templateId) => ({
        url: `/job-templates/${templateId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Templates"],
    }),

    // ── Create / Update job ──────────────────────────────────────────────────

    createJob: builder.mutation({
      query: (formData) => ({
        url: "/create-new-job_v2",   // ← matches uploadFileToGetQuestions endpoint
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Jobs"],
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          invalidateDashboardJobs(dispatch);
        } catch {
          // no-op
        }
      },
    }),

    updateJob: builder.mutation({
      query: ({ jobId, formData }) => ({
        url: `/edit-job_v1/${jobId}`,
        method: "PUT",
        body: formData,
        headers: { "Content-Type": "multipart/form-data" },
      }),
      invalidatesTags: ["Jobs"],
      async onQueryStarted({ jobId }, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          invalidateDashboardJobs(dispatch);

          // Editing a job can generate a new set of matched-candidate records.
          // Those records are held in a separate RTK Query slice, so invalidating
          // only the Jobs tag left the old candidate IDs in the UI until refresh.
          const updatedJobDetailsId = data?.data?.job_details_id || jobId;
          dispatch(
            candidatesApi.util.invalidateTags([
              { type: "Candidates", id: jobId },
              { type: "Candidates", id: updatedJobDetailsId },
            ]),
          );
        } catch {
          // no-op
        }
      },
    }),
    updateJobSummary: builder.mutation({
      query: ({ jobId, summary }) => ({
        url: `/update-job-summary/${jobId}`,
        method: "POST",
        body: {
          summary,
        },
      }),
      invalidatesTags: ["Jobs"],
    }),

    getJobDetails: builder.query({
      query: (job_details_id) => ({
        url: `/get_job_details/${job_details_id}`,
        method: "GET",
      }),
    }),
    getProgrammingSkills: builder.query({
  query: () => "/get/programming-skills",
}),
getJobsList: builder.query({
      query: ({ status = "Open" }) => {
        let url = "/get_jobs_list_v1";
        if (status && status !== "All") {
          url += `?status=${status}`;
        }
        return url;
      },
      transformResponse: (response) => {
        if (response?.success && Array.isArray(response.data)) {
          return response.data;
        }
        return [];
      },
      providesTags: ["Jobs"],
    }),

    deleteJob: builder.mutation({
      query: (jobId) => ({
        url: `/jobs/${jobId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Jobs"],
      async onQueryStarted(_jobId, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          invalidateDashboardJobs(dispatch);
        } catch {
          // no-op — error surfaced to the caller via the mutation's own promise
        }
      },
    }),

    updateJobHoldStatus: builder.mutation({
      query: ({ jobId, action, reopen_at = "", reason = "" }) => ({
        url: `/jobs/${jobId}/hold-status`,
        method: "POST",
        body: {
          action,
          ...(reopen_at ? { reopen_at } : {}),
          ...(reason ? { reason } : {}),
        },
      }),
      invalidatesTags: ["Jobs"],
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          invalidateDashboardJobs(dispatch);
        } catch {
          // no-op
        }
      },
    }),

  }),
});

export const {
  // Static data
  useGetCountriesQuery,
  useGetLocationsByCountryQuery,
  useGetWorkTypesQuery,
  useGetWorkAuthorizationsQuery,
  useGetEdcToolsQuery,
  useGetTherapeuticAreasQuery,
  useGetUsersByRoleQuery,

  // Clinical dropdowns
  useGetClinicalSubFunctionsQuery,

  // Skills
  useGetPrimarySkillsQuery,
   useGetProgrammingSkillsQuery,
  useGetNormalSkillsQuery,
  useGetMandatorySkillsQuery,
  useGetSecondarySkillsMutation,
  useGetRaveProgrammerSkillsQuery,
  useGetRaveProgrammerSecondarySkillsMutation,
  useLazyGetPrimarySkillsQuery ,
  // Templates
  useGetTemplatesQuery,
  useDeleteTemplateMutation,

  // Jobs
  useCreateJobMutation,
  useUpdateJobMutation,
  useUpdateJobSummaryMutation,

  useGetJobDetailsQuery,
  useLazyGetJobDetailsQuery,
  useGetJobsListQuery,
  useDeleteJobMutation,
  useUpdateJobHoldStatusMutation,
} = jobApi;
