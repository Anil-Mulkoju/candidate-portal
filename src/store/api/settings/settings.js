import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../baseQuery";

export const settingService = createApi({
    reducerPath: "settingService",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["Candidates", "AccountManagers"],

    endpoints: (builder) => ({

    }),
});

export const {
} = settingService;