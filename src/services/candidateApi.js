import axios from "axios";
import qs from "qs";
import {
  CANDIDATE_ACCESS_TOKEN,
  candidateClearLocalStorage,
  CANDIDATE_REFRESH_TOKEN,
  getItem,
} from "../components/Utils/helper.js";
import { toast } from "react-toastify";
import { setItem } from "../utils/helper.js";

const BaseURL = import.meta.env.VITE_BASE_URL || import.meta.env.REACT_APP_BASE_URL || "";
const candidateApi = axios.create({
  baseURL: BaseURL,
});

// --- New subscriber-based queuing mechanism (from your example) ---
let isRefreshing = false;
let refreshSubscribers = [];

const subscribeTokenRefresh = (cb) => {
  refreshSubscribers.push(cb);
};

const onTokenRefreshed = (token) => {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
};

// --- Helpers (No changes here) ---
const setAuthHeader = (configOrInstance, token) => {
  if (!token) return;
  const bearerToken = `Bearer ${token}`;
  if (configOrInstance?.headers) {
    configOrInstance.headers.Authorization = bearerToken;
  }
  if (configOrInstance?.defaults?.headers?.common) {
    configOrInstance.defaults.headers.common.Authorization = bearerToken;
  }
};

// --- Request interceptor (No changes here) ---
candidateApi.interceptors.request.use(
  (config) => {
    const token = getItem(CANDIDATE_ACCESS_TOKEN);
    // console.log("candidate_token...", CANDIDATE_ACCESS_TOKEN);

    if (token) setAuthHeader(config, token);
    return config;
  },
  (error) => Promise.reject(error)
);

candidateApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { response, config: originalRequest } = error;

    // If unauthorized/forbidden and we haven’t retried yet
    if ((response?.status === 401 || response?.status === 403) && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((newToken) => {
            setAuthHeader(originalRequest, newToken);
            resolve(candidateApi(originalRequest));
          });
        });
      }

      isRefreshing = true;

      try {
        const refresh_token = getItem(CANDIDATE_REFRESH_TOKEN);
        if (!refresh_token) {
          toast.error("Your session has expired, Please login");
          localStorage.setItem("lastPage", window.location.pathname);
          candidateClearLocalStorage();
          window.location.href = "/";
          window.location.reload();
          throw new Error("No refresh token available");
        }

        // Request new access token
        const { data } = await axios.post(
          `${BaseURL}/auth/candidate/refresh_token`,
          qs.stringify({ refresh_token }),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Accept: "application/json",
            },
          }
        );

        const newAccessToken =
          data?.data?.access_token || data?.access_token || data?.token;

        if (!newAccessToken) {
          throw new Error("Refresh succeeded but no access token returned");
        }

        // Save new token
        setItem(CANDIDATE_ACCESS_TOKEN, newAccessToken);
        setAuthHeader(candidateApi, newAccessToken);

        // Process queued requests
        onTokenRefreshed(newAccessToken);

        // Retry the original request
        setAuthHeader(originalRequest, newAccessToken);
        return candidateApi(originalRequest);
      } catch (refreshErr) {
        // ✅ Safeguard: If refresh call also failed with 401/403 → force logout
        if (
          refreshErr?.response?.status === 401 ||
          refreshErr?.response?.status === 403
        ) {
          toast.error("Your session has expired, Please login again");
        }
        candidateClearLocalStorage(CANDIDATE_ACCESS_TOKEN);
        candidateClearLocalStorage(CANDIDATE_REFRESH_TOKEN);
        window.location.href = "/for-candidate/login";
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);


export default candidateApi;
