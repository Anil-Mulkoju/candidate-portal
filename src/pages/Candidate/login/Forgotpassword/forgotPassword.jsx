import React, { useState, useRef } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  CircularProgress,
  InputAdornment,
  IconButton,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import candidateApi from "../../../../services/candidateApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { CANDIDATE_ACCESS_TOKEN, setItem } from "../../../../utils/helper";

/* ── style tokens ── */
const TEAL = "#3D8B8B";
const cardSx = {
  width: { xs: "95%", sm: "100%", md: "100%", lg: "100%" },
  p: { xs: 3, sm: 4, lg: 4 },
  backgroundColor: "white",
  borderRadius: "10px",
  boxShadow: "0 2px 16px rgba(0,0,0,0.10)",
};
const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "6px",
    "& fieldset": { borderColor: "#D9D9D9" },
    "&:hover fieldset": { borderColor: TEAL },
    "&.Mui-focused fieldset": { borderColor: TEAL, borderWidth: 1 },
  },
};
const fullBtnSx = {
  width: "100%",
  py: 1.6,
  mt: 2,
  backgroundColor: TEAL,
  borderRadius: "10px",
  fontSize: 15,
  fontWeight: 600,
  textTransform: "none",
  boxShadow: "none",
  "&:hover": { backgroundColor: "#2f7070", boxShadow: "none" },
};

const ForgotPassword = ({ setForgotPasswordOpen }) => {
  const [step, setStep] = useState("email"); // "email" | "otp" | "reset"
  const [formData, setFormData] = useState({
    email: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [disableGo, setDisableGo] = useState(false);
  const [otpToken, setOtpToken] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const inputRefs = useRef([]);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") setDisableGo(false);
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({
      ...prev,
      [name]: value.trim()
        ? ""
        : `${name.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase())} is required`,
    }));
  };

  const handleOtpDigit = (e, idx) => {
    const val = e.target.value.replace(/\D/, "").slice(-1);
    setOtp((prev) => {
      const next = [...prev];
      next[idx] = val;
      return next;
    });
    if (val && idx < 5) inputRefs.current[idx + 1]?.focus();
  };

  const handleOtpKey = (e, idx) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  };

  /* Step 1 – send OTP */
  const handleEmailSubmit = async () => {
    if (!formData.email) {
      setErrors((p) => ({ ...p, email: "Email is required" }));
      return;
    }
    try {
      setLoading(true);
      const response = await candidateApi.post(
        `/auth/candidate/forgot_password?email=${formData.email}`
      );
      const data = response.data;
      if (data?.success) {
        setItem(CANDIDATE_ACCESS_TOKEN, data?.access_token);
        toast.success(data?.message || "OTP sent to your email!");
        setDisableGo(true);
        setStep("otp");
      } else {
        toast.error(data?.message || "Failed to reset password");
      }
    } catch (error) {
      console.error("Forgot password error:", error.response?.data || error.message);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* Step 2 – validate OTP */
  const handleOtpSubmit = async () => {
    const otpValue = otp.join("");
    if (otpValue.length < 6) {
      toast.error("Please enter the complete 6-digit OTP");
      return;
    }
    try {
      const response = await candidateApi.post(
        `/auth/candidate/validate_otp?otp=${otpValue}`
      );
      const data = response.data;
      console.log("OTP success...", data);
      if (data?.success) {
        setOtpToken(data?.otp_token);
        toast.success("OTP verified successfully!");
        setStep("reset");
      } else {
        toast.error(data?.message || "Failed to validate OTP");
      }
    } catch (error) {
      console.error("OTP error:", error.response?.data || error.message);
      toast.error("An error occurred. Please try again.");
    }
  };

  /* Step 3 – set new password */
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!formData.newPassword) { toast.error("New Password is required"); return; }
    if (!formData.confirmPassword) { toast.error("Confirm Password is required"); return; }
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      setLoading(true);
      const response = await candidateApi.post(
        `/auth/candidate/set_new_password?new_password=${encodeURIComponent(formData.newPassword)}&confirm_password=${encodeURIComponent(formData.confirmPassword)}`,
        {},
        { headers: { "otp-token": otpToken, Accept: "application/json" } }
      );
      const data = response.data;
      console.log("Set Password Response:", data);
      if (data?.success) {
        toast.success(data?.message || "Password reset successfully!");
        setForgotPasswordOpen(false);
      } else {
        toast.error(data?.message || "Failed to reset password");
      }
    } catch (error) {
      console.error("Set password error:", error?.response?.data || error.message);
      toast.error(error?.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid
      container
      width={"100%"}
      size={{ xs: 12, sm: 10, lg: 10, xl: 10 }}
      sx={{ display: "flex", justifyContent: "center", mt: 1 }}
    >
      {/* ── Step 1: Email ── */}
      {step === "email" && (
        <Grid item sx={cardSx}>
          <Typography variant="h6" color="#000" fontWeight={700} gutterBottom>
            Forgot Password
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={0.75}>
            Enter your registered email to recieve otp
          </Typography>
          <TextField
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            fullWidth
            placeholder="Enter"
            variant="outlined"
            size="small"
            sx={inputSx}
          />

          <Button
            onClick={handleEmailSubmit}
            variant="contained"
            disabled={disableGo || loading}
            sx={fullBtnSx}
          >
            {loading ? <CircularProgress size={22} sx={{ color: "#fff" }} /> : "Generate Otp"}
          </Button>

          <Box mt={2}>
            <Typography
              variant="body2"
              sx={{ color: TEAL, cursor: "pointer", display: "inline" }}
              onClick={() => navigate("/for-candidate/signup")}
            >
              Create Account
            </Typography>
          </Box>
        </Grid>
      )}

      {/* ── Step 2: OTP ── */}
      {step === "otp" && (
        <Grid item sx={cardSx}>
          <Typography variant="h6"  color="#000" fontWeight={700} gutterBottom>
            Enter Otp
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Enter the received OTP to reset your password. Please check your email for the OTP.
          </Typography>

          <Box sx={{ display: "flex", gap: 1.5, mb: 1 }}>
            {otp.map((digit, idx) => (
              <TextField
                key={idx}
                inputRef={(el) => (inputRefs.current[idx] = el)}
                value={digit}
                onChange={(e) => handleOtpDigit(e, idx)}
                onKeyDown={(e) => handleOtpKey(e, idx)}
                inputProps={{
                  maxLength: 1,
                  style: {
                    textAlign: "center",
                    fontSize: 22,
                    fontWeight: 600,
                    padding: "12px 0",
                  },
                }}
                variant="outlined"
                sx={{
                  flex: 1,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    "& fieldset": { borderColor: "#D9D9D9" },
                    "&:hover fieldset": { borderColor: TEAL },
                    "&.Mui-focused fieldset": { borderColor: TEAL, borderWidth: 1 },
                  },
                }}
              />
            ))}
          </Box>

          <Button onClick={handleOtpSubmit} variant="contained" sx={fullBtnSx}>
            Reset Password
          </Button>
        </Grid>
      )}

      {/* ── Step 3: Reset Password ── */}
      {step === "reset" && (
        <Grid item sx={cardSx}>
          <Typography variant="h6"  color = "#000" fontWeight={700} align="center" gutterBottom>
            Reset Password
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" mb={3}>
            Choose a new password for your account
          </Typography>

          <TextField
            name="newPassword"
            type={showNewPassword ? "text" : "password"}
            value={formData.newPassword}
            onChange={handleChange}
            error={!!errors.newPassword}
            helperText={errors.newPassword}
            fullWidth
            placeholder="Enter Password"
            variant="outlined"
            size="small"
            sx={{ ...inputSx, mb: 2 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowNewPassword((p) => !p)}
                    edge="end"
                    size="small"
                  >
                    {showNewPassword ? (
                      <VisibilityOff fontSize="small" sx={{ color: "#9e9e9e" }} />
                    ) : (
                      <Visibility fontSize="small" sx={{ color: "#9e9e9e" }} />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={formData.confirmPassword}
            onChange={handleChange}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
            fullWidth
            placeholder="Enter Confirm Password"
            variant="outlined"
            size="small"
            sx={inputSx}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword((p) => !p)}
                    edge="end"
                    size="small"
                  >
                    {showConfirmPassword ? (
                      <VisibilityOff fontSize="small" sx={{ color: "#9e9e9e" }} />
                    ) : (
                      <Visibility fontSize="small" sx={{ color: "#9e9e9e" }} />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            onClick={handlePasswordSubmit}
            variant="contained"
            disabled={loading}
            sx={fullBtnSx}
          >
            {loading ? <CircularProgress size={22} sx={{ color: "#fff" }} /> : "Set New Password"}
          </Button>
        </Grid>
      )}
    </Grid>
  );
};

export default ForgotPassword;