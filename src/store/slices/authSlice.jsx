import { createSlice } from "@reduxjs/toolkit";
import {
  getItem,
  getUserData,
  USER_ROLE,
  IS_AUTHENTICATED,
} from "../../utils/helper";

const initialState = {
  user: getUserData(),
  role: getItem(USER_ROLE),
  isAuthenticated: getItem(IS_AUTHENTICATED) === "true",
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },

    loginSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.role = action.payload.role;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
      state.error = null;
    },

    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    },

    logout: (state) => {
      state.user = null;
      state.role = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },

    setUser: (state, action) => {
      state.user = action.payload.user;
      state.role = action.payload.role;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  setUser,
} = authSlice.actions;

export const selectAuthRole = (state) => state.auth?.role || "";

export default authSlice.reducer;