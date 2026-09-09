import { createSlice } from "@reduxjs/toolkit";
import {
  CANDIDATE_ACCESS_TOKEN,
  CANDIDATE_REFRESH_TOKEN,
  candidateClearLocalStorage,
  getItem,
  setItem,
} from "../../utils/helper";

const initialState = {
  user: null,
  profile: null,
  accessToken: getItem(CANDIDATE_ACCESS_TOKEN) || null,
  refreshToken: getItem(CANDIDATE_REFRESH_TOKEN) || null,
  isAuthenticated: Boolean(getItem(CANDIDATE_ACCESS_TOKEN)),
  loading: false,
  error: null,
  formData: {
    loginDetails: {},
    candidateDetails: {},
    employmentDetails: {},
    basicDetails: {},
    educationDetails: {},
    personalDetails: {},
    candidateCompleateDetails: {},
    certifications: [],
    resume: null,
  },
};

const candidateSlice = createSlice({
  name: "candidate",
  initialState,
  reducers: {
    candidateLoginStart: (state) => {
      state.loading = true;
      state.error = null;
    },

    candidateLoginSuccess: (state, action) => {
      const { user, accessToken, refreshToken } = action.payload;
      state.loading = false;
      state.user = user;
      state.accessToken = accessToken || state.accessToken;
      state.refreshToken = refreshToken || state.refreshToken;
      state.isAuthenticated = Boolean(accessToken || state.accessToken);
      state.error = null;

      if (accessToken) {
        setItem(CANDIDATE_ACCESS_TOKEN, accessToken);
      }
      if (refreshToken) {
        setItem(CANDIDATE_REFRESH_TOKEN, refreshToken);
      }
    },

    candidateLoginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
      state.accessToken = null;
      state.refreshToken = null;
    },

    candidateLogout: (state) => {
      candidateClearLocalStorage();
      state.user = null;
      state.profile = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },

    candidateSetProfile: (state, action) => {
      state.profile = action.payload;
    },

    candidateSetUser: (state, action) => {
      state.user = action.payload;
    },

    candidateClearError: (state) => {
      state.error = null;
    },

    candidateUpdateFormData: (state, action) => {
      const { section, updates } = action.payload;
      if (!section) return;
      state.formData[section] = {
        ...(state.formData[section] || {}),
        ...(updates || {}),
      };
    },

    candidateSetFormData: (state, action) => {
      state.formData = {
        ...state.formData,
        ...action.payload,
      };
    },

    candidateSetInitialData: (state, action) => {
      state.formData = {
        ...state.formData,
        candidateDetails: action.payload || {},
      };
    },

    // A new resume replaces the parsed source data, so drafts from a previous
    // resume must not take precedence over the newly extracted values.
    candidateSetResumeParsedData: (state, action) => {
      state.formData = {
        ...state.formData,
        candidateDetails: action.payload || {},
        employmentDetails: {},
        educationDetails: {},
        personalDetails: {},
      };
    },
  },
});

export const {
  candidateLoginStart,
  candidateLoginSuccess,
  candidateLoginFailure,
  candidateLogout,
  candidateSetProfile,
  candidateSetUser,
  candidateClearError,
  candidateUpdateFormData,
  candidateSetFormData,
  candidateSetInitialData,
  candidateSetResumeParsedData,
} = candidateSlice.actions;

export default candidateSlice.reducer;
