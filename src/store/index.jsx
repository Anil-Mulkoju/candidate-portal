import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import jobReducer from "./slices/jobSlice";
import globalSearchReducer from "./slices/globalSearchSlice";
import candidateReducer from "./slices/candidateSlice";

import { authApi } from "./api/authApi";
import { dashboardApi } from "./api/dashboardApi";
import { jobApi } from "./api/jobApi";
import { actionRequestApi } from "./api/actionRequestApi";
import { candidatesApi } from "./api/CandidateApi";
import { organisationService } from "./api/settings/organisation";
import { myProfileService } from "./api/settings/myProfile";
import { userManagementService } from "./api/settings/userManagement";
import { departmentService } from "./api/settings/departmentService";
import { interviewApi } from "./api/interviewApi.jsx";
import { candidatePortalService } from "./api/settings/CandidatePortalApis";
import candidateGapAnalysisApi from "../services/candiadteGapApi.js";
import candidateJobsApi from "../services/candidateJobsApi.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    job: jobReducer,
    globalSearch: globalSearchReducer,
    candidate: candidateReducer,
    [authApi.reducerPath]: authApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
    [jobApi.reducerPath]: jobApi.reducer,
    [actionRequestApi.reducerPath]: actionRequestApi.reducer,
    [candidatesApi.reducerPath]: candidatesApi.reducer,
    [interviewApi.reducerPath]: interviewApi.reducer,
    [organisationService.reducerPath]: organisationService.reducer,
    [myProfileService.reducerPath]: myProfileService.reducer,
    [userManagementService.reducerPath]: userManagementService.reducer,
    [departmentService.reducerPath]: departmentService.reducer,
    [candidatePortalService.reducerPath]: candidatePortalService.reducer,
    [candidateGapAnalysisApi.reducerPath]: candidateGapAnalysisApi.reducer,
    [candidateJobsApi.reducerPath]: candidateJobsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(dashboardApi.middleware)
      .concat(jobApi.middleware)
      .concat(actionRequestApi.middleware)
      .concat(candidatesApi.middleware)
      .concat(interviewApi.middleware)
      .concat(organisationService.middleware)
      .concat(myProfileService.middleware)
      .concat(userManagementService.middleware)
      .concat(departmentService.middleware)
      .concat(candidatePortalService.middleware)
      .concat(candidateGapAnalysisApi.middleware)
      .concat(candidateJobsApi.middleware),
});
