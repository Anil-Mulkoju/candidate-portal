
import axios from "axios";
import qs from "qs";
// import { ACCESS_TOKEN, clearLocalStorage, REFRESH_TOKEN } from "../src/components/Utils/helper";
import { ACCESS_TOKEN,AUTH_VERSION,PROFILE_VERSION,REFRESH_TOKEN,clearLocalStorage, getItem, setItem } from "./utils/helper";
import { toast } from "react-toastify";
import { refreshMeSilently } from "./services/meService";

const BaseURL = import.meta.env.VITE_BASE_URL || import.meta.env.REACT_APP_BASE_URL || ""
const api = axios.create({
  baseURL: BaseURL,
});
// console.log("baseURL",BaseURL)
// const apiURL = process.env.REACT_APP_BASE_URL
// const api = axios.create({
//   baseURL: apiURL,
// });

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
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) setAuthHeader(config, token);
    return config;
  },
  (error) => Promise.reject(error)
);

// --- Response interceptor with new queuing logic ---
// api.interceptors.response.use(
//   async (response) => {
//     const originalRequest = response.config;
//     const responseData = response?.data;

//     const isCustomAuthError =
//       responseData &&
//       responseData.success === false &&
//       (String(responseData.status) === '401'||String(responseData.status) === '403');

//     if (isCustomAuthError && !originalRequest._retry) {
//       originalRequest._retry = true;

//       if (isRefreshing) {
//         // A refresh is already in flight. Add this request's retry logic to the queue.
//         return new Promise((resolve) => {
//           subscribeTokenRefresh((newToken) => {
//             setAuthHeader(originalRequest, newToken);
//             resolve(api(originalRequest)); // Re-run the original request and resolve the promise
//           });
//         });
//       }

//       isRefreshing = true;

//       try {
//         const refresh_token = localStorage.getItem(REFRESH_TOKEN);
//         if (!refresh_token) {
//           toast.error("Your session has expired, Please login");
//           localStorage.setItem("lastPage", window.location.pathname);
//           clearLocalStorage();
//           window.location.href = "/";
//           window.location.reload();
//           throw new Error("No refresh token available")
//         };

//         const { data } = await axios.post(
//           `${apiURL}/auth/refresh-access-token`,
//           qs.stringify({ refresh_token }),
//           {
//             headers: {
//               "Content-Type": "application/x-www-form-urlencoded",
//               Accept: "application/json",
//             },
//           }
//         );

//         const newAccessToken =
//           data?.data?.access_token || data?.access_token || data?.token;
//         if (!newAccessToken) {
//           toast.error("Your session has expired, Please login");
//           localStorage.setItem("lastPage", window.location.pathname);
//           clearLocalStorage();
//           window.location.href = "/";
//           window.location.reload();
//           throw new Error("Refresh succeeded but no access token returned");
//         }

//         localStorage.setItem(ACCESS_TOKEN, newAccessToken);
//         setAuthHeader(api, newAccessToken);

//         // Token has been refreshed, now process all the queued requests
//         onTokenRefreshed(newAccessToken);

//         // Retry the original request (the one that triggered the refresh)
//         setAuthHeader(originalRequest, newAccessToken);
//         return api(originalRequest);

//       } catch (refreshErr) {
//         // If the refresh fails, log the user out.
//         // The promises of queued requests will be rejected automatically.
//         localStorage.removeItem(ACCESS_TOKEN);
//         localStorage.removeItem(REFRESH_TOKEN);
//         window.location.href = "/login";
//         return Promise.reject(refreshErr);
//       } finally {
//         isRefreshing = false;
//       }
//     }

//     return response;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

let isProfileRefreshing = false;

api.interceptors.response.use(
  async (response) => {
    const url = response.config.url || "";

    // Skip auth & profile APIs
    if (
      url.includes("/auth/login") ||
     url.includes("/auth/refresh-access-token") ||
      url.includes("/auth/sync_me")
    ) {
      return response;
    }

    const serverVersion = response.data?.meta?.profile_version;
    if (!serverVersion) return response;

    const localVersion = getItem(PROFILE_VERSION);

    if (
      !isProfileRefreshing &&
      (!localVersion || String(serverVersion) !== String(localVersion))
    ) {
      isProfileRefreshing = true;

      // console.log(`Profile version changed ${localVersion} → ${serverVersion}`);

      try {
        await refreshMeSilently();
        setItem(PROFILE_VERSION, String(serverVersion));
      } finally {
        isProfileRefreshing = false;
      }
    }

    return response;
  },
  async (error) => {
    const { response, config: originalRequest } = error;

    // If unauthorized/forbidden and we haven’t retried yet
    if ((response?.status === 401 || response?.status === 403) && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((newToken) => {
            setAuthHeader(originalRequest, newToken);
            resolve(api(originalRequest));
          });
        });
      }

      isRefreshing = true;

      try {
        const refresh_token = getItem(REFRESH_TOKEN);
        if (!refresh_token) {
          toast.error("Your session has expired, Please login");
          localStorage.setItem("lastPage", window.location.pathname);
          clearLocalStorage()
          window.location.href = "/";
          window.location.reload();
          throw new Error("No refresh token available");
        }

        // Request new access token
        const { data } = await axios.post(
          `${BaseURL}/auth/refresh-access-token`,
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
        setItem(ACCESS_TOKEN, newAccessToken);
        setAuthHeader(api, newAccessToken);

        // Process queued requests
        onTokenRefreshed(newAccessToken);

        //========================= Retry the original request
        setAuthHeader(originalRequest, newAccessToken);
        return api(originalRequest);
      } catch (refreshErr) {
        // ================= Safeguard: If refresh call also failed with 401/403 → force logout ===========================//
        if (
          refreshErr?.response?.status === 401 ||
          refreshErr?.response?.status === 403
        ) {
          toast.error("Your session has expired, Please login again");
        }
        clearLocalStorage(ACCESS_TOKEN);
        clearLocalStorage(REFRESH_TOKEN);
        window.location.href = "/recruit/login";
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;