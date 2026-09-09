// src/pages/Candidate/GoogleRedirectHandler.jsx
import React, { useEffect, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  CANDIDATE_ACCESS_TOKEN,
  CANDIDATE_REFRESH_TOKEN,
  IS_AUTHENTICATED,
  setItem,
} from "../utils/helper"; // adjust path if needed
// import { CandidateContext } from "../context/CandidateContext";
import { AppContext } from "../AppContext";

const GoogleRedirectHandler = ({ children }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  console.log("searchParams",searchParams);
  console.log("window.location.search",window.location.search);
  
//   const { updateFormData } = useContext(CandidateContext);
  const { setLoading } = useContext(AppContext);

useEffect(() => {
  const params = new URLSearchParams(window.location.search); // fallback
  const accessToken = params.get("access_token");
  const refreshToken = params.get("refresh_token");
  const email = params.get("email");
  const isNewUser = params.get("is_new_user") === "true";

console.log("Current URL:", window.location.href);
  console.log("Tokens:", accessToken, refreshToken);
  console.log("Email & new user:", email, isNewUser);

  if (accessToken && refreshToken) {
    setItem(CANDIDATE_ACCESS_TOKEN, accessToken);
    setItem(CANDIDATE_REFRESH_TOKEN, refreshToken);
    setItem(IS_AUTHENTICATED, true);

    if (isNewUser) {
      navigate("/for-candidate/profile-register", { replace: true });
    } else {
      navigate("/for-candidate/profile", { replace: true });
    }
  }
}, []);



  // Render children (LandingPage) if no token flow — otherwise user will be navigated away
  return <>{children}</>;
};

export default GoogleRedirectHandler;
