// src/redux/api/baseQuery.js
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import qs from "qs";

import {
  ACCESS_TOKEN,
  REFRESH_TOKEN,
  getItem,
  setItem,
  clearLocalStorage,
} from "../../utils/helper";

const BaseURL = import.meta.env.VITE_BASE_URL || import.meta.env.REACT_APP_BASE_URL || "";

console.log("BaseURL:", BaseURL);let refreshPromise = null;

const rawBaseQuery = fetchBaseQuery({
  baseUrl: BaseURL,

  prepareHeaders: (headers) => {
    const token = getItem(ACCESS_TOKEN);

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

export const baseQueryWithReauth = async (
  args,
  api,
  extraOptions
) => {
  let result = await rawBaseQuery(
    args,
    api,
    extraOptions
  );

if (
  result?.error?.status === 401 ||
  result?.error?.status === 403
) {
  const refreshToken = getItem(REFRESH_TOKEN);

  if (!refreshToken) {
    clearLocalStorage();
    window.location.href = "/recruit/login";
    return result;
  }

  if (!refreshPromise) {
    refreshPromise = rawBaseQuery(
      {
        url: "/auth/refresh-access-token",
        method: "POST",
        headers: {
          "Content-Type":
            "application/x-www-form-urlencoded",
        },
        body: qs.stringify({
          refresh_token: refreshToken,
        }),
      },
      api,
      extraOptions
    ).finally(() => {
      refreshPromise = null;
    });
  }

  const refreshResult =
    await refreshPromise;

  const newAccessToken =
    refreshResult?.data?.data?.access_token ||
    refreshResult?.data?.access_token ||
    refreshResult?.data?.token;

  if (newAccessToken) {
    setItem(
      ACCESS_TOKEN,
      newAccessToken
    );

    result = await rawBaseQuery(
      args,
      api,
      extraOptions
    );
  } else {
    clearLocalStorage();
    window.location.href = "/recruit/login";
  }
}

  return result;
};