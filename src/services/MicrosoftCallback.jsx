import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const MicrosoftCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");

    if (accessToken) {
      localStorage.setItem(
        "candidate_access_token",
        accessToken
      );

      localStorage.setItem(
        "candidate_refresh_token",
        refreshToken
      );

      navigate("/for-candidate/profile");
    } else {
      navigate("/for-candidate/register");
    }
  }, [navigate]);

  return null;
};

export default MicrosoftCallback;