import { USER_ROLE } from "../../utils/helper";

export const IS_AUTHENTICATED = "isAuthenticated"
export const USER_DATA = "user";
export const AUTH_DETAILS = "auth-details"
export const ACCESS_TOKEN = "accessToken";
export const REFRESH_TOKEN = "refreshToken";
export const EXPIRY_TIME = "expiryTime";
export const USER_TYPE = "userType";
// export const USER_ROLE = "userName";
// export const TIMEZONE = "timeZone";

export const CANDIDATE_ACCESS_TOKEN = "candidate_access_token"
export const CANDIDATE_REFRESH_TOKEN = "candidate_refresh_token"

export const setItem = (key, value) => {
    localStorage.setItem(key, value)
}

export const getItem = (key) => {
    return localStorage.getItem(key)
}
export const clearLocalStorage = () => {
    localStorage.removeItem(EXPIRY_TIME);
    localStorage.removeItem(REFRESH_TOKEN);
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(AUTH_DETAILS);
    localStorage.removeItem(USER_DATA);
    localStorage.removeItem(IS_AUTHENTICATED)
    localStorage.removeItem(USER_TYPE);
    localStorage.removeItem(USER_ROLE);
    // localStorage.removeItem(TIME_ZONE);
}
export const candidateClearLocalStorage = () => {
    localStorage.removeItem(CANDIDATE_ACCESS_TOKEN);
    localStorage.removeItem(CANDIDATE_REFRESH_TOKEN);
}
export const getUserData = () => {
    const data = localStorage.getItem(USER_DATA);
    return data && JSON.parse(data);
}
export const tokenData = () => {
    const data = localStorage.getItem(AUTH_DETAILS);
    return data && JSON.parse(data);
}