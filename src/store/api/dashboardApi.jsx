import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";

export const dashboardApi = createApi({
    reducerPath: "dashboardApi",

    baseQuery: baseQueryWithReauth,

    tagTypes: ["Dashboard", "DashboardJobs"],

    endpoints: (builder) => ({
        getCandidateListByStatus: builder.query({
            query: (status = "") => ({
                url: "/candidate_list_by_status",
                params: { status },
            }),
        }),

        getJobAnalytics: builder.query({
            query: ({
                groupBy = "month",
                periodCount = 6,
                status = "all",
                scope = "user",
                countsType = "cumulative",
                filterBySubfunction = "",   // empty = All
                country = "all",
            } = {}) => {
                const isAllTime = periodCount === "all";
                return {
                    url: "/organisations/job-analytics_v2",
                    params: {
                        group_by: groupBy,
                        status,
                        scope,
                        counts_type: countsType,
                        all_time: isAllTime,
                        ...(isAllTime ? {} : { period_count: periodCount }),
                        country,
                        ...(filterBySubfunction ? { filter_by_subfunction: filterBySubfunction } : {}),
                    },
                };
            },
            providesTags: ["DashboardJobs"],
        }),

        getStageDetails: builder.query({
            query: ({
                stage, period = "", status = "all", scope = "user",
                countsType = "cumulative", filterBySubfunction = "",
                country = "all", page = 1, pageSize = 50,
            }) => ({
                url: "/analytics/jobs/stage-details",
                params: {
                    stage, period, status, scope,
                    counts_type: countsType,
                    country,
                    ...(filterBySubfunction ? { filter_by_subfunction: filterBySubfunction } : {}),
                    page, page_size: pageSize,
                },
            }),
            // Stage dialogs are often reopened while reviewing candidates.
            // Keep their paginated results in the Redux RTK Query cache so
            // reopening a stage is immediate instead of making another call.
            keepUnusedDataFor: 300,
        }),

        getJobsList: builder.query({
            query: ({
                status = "all",
                country = "all",
                filterBySubfunction = "all",
                periodCount,   // 3 | 6 | "all"/undefined = leave empty (all time)
            } = {}) => ({
                url: "/get_jobs_list_v1",
                params: {
                    status,
                    country,
                    // The sub-function filter key is underscored (e.g. "clinical_data_manager"),
                    // but this endpoint expects it space-separated (e.g. "clinical data manager").
                    sub_function: filterBySubfunction ? filterBySubfunction.replace(/_/g, " ") : "all",
                    ...(periodCount === 3 || periodCount === 6 ? { period: periodCount } : {}),
                },
            }),
            providesTags: ["DashboardJobs"],
        }),

        // ── org-wide stage drill-down — now filter-aware ─────────────────────
        // getStageDetails: builder.query({
        //     query: ({
        //         stage,
        //         period = "",
        //         status = "all",
        //         scope = "user",
        //         countsType = "cumulative",
        //         domain = "all",
        //         function: fn = "all",
        //         subFunction = "all",
        //         page = 1,
        //         pageSize = 50,
        //     }) => ({
        //         url: "/analytics/jobs/stage-details",
        //         params: {
        //             stage,
        //             period,            // leave blank to get all months, never force a specific month
        //             status,
        //             scope,
        //             counts_type: countsType,
        //             domain,
        //             function: fn,
        //             sub_function: subFunction,
        //             page,
        //             page_size: pageSize,
        //         },
        //     }),
        // }),

        // ── Job analytics by specific job ID ─────────────────────────────────
       getJobAnalyticsById: builder.query({
    query: ({
        job_details_id,
        groupBy = "month",
        periodCount = 6,
        status = "all",
        countsType = "cumulative",
    }) => {
        // Backend expects job_ids as REPEATED query params (job_ids=a&job_ids=b),
        // not a single comma-joined value — a plain `params: { job_ids }` object
        // can't produce that shape (URLSearchParams stringifies an array value
        // with commas too), so it's built into the URL directly here. Accepts
        // either an array or our existing comma-joined string (from multi-select).
        const ids = Array.isArray(job_details_id)
            ? job_details_id
            : String(job_details_id || "").split(",").map((id) => id.trim()).filter(Boolean);
        const jobIdsQuery = ids.map((id) => `job_ids=${encodeURIComponent(id)}`).join("&");
        return {
            url: `/analytics/jobs/by-id?${jobIdsQuery}`,
            params: {
                group_by: groupBy,
                period_count: periodCount,
                status,
                counts_type: countsType,
            },
        };
    },
    keepUnusedDataFor: 60,
}),

        // ── Stage-level candidate drill-down for a specific job ──────────────
        getJobStageDetails: builder.query({
            query: ({ jobIds, jobId, stage, period = "", countsType = "cumulative", country = "all_locations", page = 1, pageSize = 10 }) => {
                const ids = Array.isArray(jobIds)
                    ? jobIds
                    : String(jobIds || jobId || "").split(",").map((id) => id.trim()).filter(Boolean);
                const jobIdsQuery = ids
                    .map((id) => `job_ids=${encodeURIComponent(id)}`)
                    .join("&");

                return {
                    url: `/analytics/jobs/by-id/stage-details?${jobIdsQuery}`,
                    params: {
                        stage,
                        period,
                        counts_type: countsType,
                        country,
                        page,
                        page_size: pageSize,
                    },
                };
            },
            keepUnusedDataFor: 30,
        }),
        getSubFunctions: builder.query({
            query: () => ({
                url: "/dropdown/job-analytics/sub-functions",
            }),
            keepUnusedDataFor: 300,
        }),

    }),
});

export const {
    useGetCandidateListByStatusQuery,
    useGetJobAnalyticsQuery,
    useGetJobsListQuery,
    useLazyGetStageDetailsQuery,
    useGetJobAnalyticsByIdQuery,
    useLazyGetJobStageDetailsQuery,
    useGetSubFunctionsQuery,
} = dashboardApi;
