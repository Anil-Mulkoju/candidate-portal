import api from "../api";
import { PROFILE_VERSION, setItem, TIME_ZONE, USER_ROLE } from "../utils/helper";

export const refreshMeSilently = async () => {

    const response = await api.get("/auth/sync_me");
     if (response?.data?.success) {
    const { data, meta } = response.data;

    if (meta?.profile_version) {
      setItem(PROFILE_VERSION, String(meta.profile_version));
    }

    if (data?.user_role) {
      setItem(USER_ROLE, data.user_role);
    }

    const timeZone =
      data?.employee_time_zone || data?.organisation_time_zone;

    if (timeZone) {
      setItem(TIME_ZONE, timeZone);
    }
  }

  return response;

    // const data = res.data;

    // setItem("USER_ROLE", data.user_role.toUpperCase());
    // setItem("USER_DATA", JSON.stringify(data));
    // setItem("AUTH_VERSION", String(data.auth_version));
 
};
