import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  Grid,
  CircularProgress,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import candidateApi from "../../../services/candidateApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { CANDIDATE_ACCESS_TOKEN, setItem } from "../../../utils/helper";
import axios from "axios";

const ForgotPassword = ({ setForgotPasswordOpen }) => {
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({ email: "" });
  const [togglePassword, setTogglePassword] = useState(false);
  const [disableGo, setDisableGo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpToken, setOtpToken] = useState("");

  const navigate = useNavigate();
  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") {
      setDisableGo(false);
    }
    // Update form data
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Validate only the changed field
    setErrors((prev) => {
      const updatedErrors = { ...prev };

      if (!value.trim()) {
        updatedErrors[name] = `${name
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (c) => c.toUpperCase())} is required`;
      } else {
        updatedErrors[name] = "";
      }

      return updatedErrors;
    });
  };

  const handleEmailSubmit = async () => {
    // if (!formData.email) {
    //     setErrors((prev) => ({ ...prev, email: 'Email is required' }));
    //     return;
    // }
    // navigate("/for-candidate/otp-verification", {
    //   state: { email: formData.email },
    // });
    try {
      setLoading(true);
      const response = await candidateApi.post(
        `/auth/candidate/forgot_password?email=${formData.email}`
      );
      const data = response.data;
      console.log("Email Submit...", data?.access_token);
      if (data?.success) {
        setItem(CANDIDATE_ACCESS_TOKEN, data?.access_token);
        setLoading(false);
        toast.success(data?.message || "OTP sent to your email!");
        setDisableGo(true);
      } else {
        toast.error(data?.message || "Failed to reset password");
      }
    } catch (error) {
      console.error(
        "Forgot password error:",
        error.response?.data || error.message
      );
      toast.error("An error occurred. Please try again.");
    }
  };
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email && !formData.otp) {
      setErrors((prev) => ({
        ...prev,
        email: "Email is required",
        otp: "OTP is required",
      }));
      return;
    }

    try {
      //   const queryParams = `?otp=${formData.otp}&new_password=${formData.newPassword}&confirm_password=${formData.confirmPassword}`;
      const queryParams = `?otp=${formData.otp}`;
      const response = await candidateApi.post(
        `/auth/candidate/validate_otp${queryParams}`
      );
      const data = response.data;
      console.log("OTP success...", data);
      if (data?.success) {
        setOtpToken(data?.otp_token);
        toast.success("Password reset successfully!");
        setTogglePassword(true);
        // navigate("/for-candidate/login");
      } else {
        toast.error(data?.message || "Failed to reset password");
      }
    } catch (error) {
      console.error(
        "Reset password error:",
        error.response?.data || error.message
      );
      toast.error("An error occurred. Please try again.");
    }
    // Submit the form (e.g., send data to the server)
    console.log("Form submitted:", formData);
  };
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.newPassword || !formData.confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        newPassword: !formData.newPassword ? "New password is required" : "",
        confirmPassword: !formData.confirmPassword
          ? "Confirm password is required"
          : "",
      }));
      return;
    }

    // Check if passwords match
    if (formData.newPassword !== formData.confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match",
      }));
      toast.error("Passwords do not match");
      return;
    }

    try {
      const queryParams = `?new_password=${formData.newPassword}&confirm_password=${formData.confirmPassword}`;
      const response = await axios.post(
        `/auth/candidate/set_new_password${queryParams}`,
        {},
        {
          headers: {
            "otp-token": otpToken,
            Accept: "application/json",
          },
        }
      );

      const data = response.data;
      console.log("ConfirmPassword...", data);

      if (data?.success) {
        setForgotPasswordOpen(false);
        toast.success(data?.message || "Password reset successfully!");
        //   navigate("/for-candidate/login");
      } else {
        toast.error(data?.message || "Failed to reset password");
      }
    } catch (error) {
      console.error(
        "Reset password error:",
        error.response?.data || error.message
      );
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <Grid
      container
      width={"100%"}
      size={{ xs: 12, sm: 10, lg: 10, xl: 10 }}
      sx={{ display: "flex", justifyContent: "center" ,mt:1}}
    >
      {togglePassword ? (
        <Grid
          item
          gap={2}
          sx={{
            width: { xs: "95%", sm: "100%", md: "100%", lg: "100%" },
            p: { xs: 3, sm: 4, lg: 4 },
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: 2,
          }}
        >
          <Typography
            variant="h2"
            fontSize={18}
            align="center"
            gutterBottom
            mb={2}
          >
            Reset Password
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <TextField
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              error={!!errors.newPassword}
              helperText={errors.newPassword}
              fullWidth
              placeholder="Enter Password"
              variant="outlined"
              size="small"
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root": {
                  "&:hover fieldset": {
                    borderColor: "#00BBD4",
                  },
                  "&.Mui-focused fieldset": {
                    borderWidth: 1,
                    borderColor: "#00BBD4",
                  },
                },
              }}
            />
            <TextField
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              fullWidth
              placeholder="Enter Confirm Password"
              variant="outlined"
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": {
                  "&:hover fieldset": {
                    borderColor: "#00BBD4",
                  },
                  "&.Mui-focused fieldset": {
                    borderWidth: 1,
                    borderColor: "#00BBD4",
                  },
                },
              }}
            />
            <Button
              onClick={handlePasswordSubmit}
              variant="contained"
              sx={{ backgroundColor: "#00BBD4", mt: 2 }}
            >
              Submit
            </Button>
          </Box>
        </Grid>
      ) : (
        <Grid
          item
          sx={{
            width: { xs: "95%", sm: "100%", md: "100%", lg: "100%" },
            p: { xs: 3, sm: 4, lg: 4 },
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: 2,
          }}
        >
          <Typography variant="h2" fontSize={18} align="center" gutterBottom>
            Forgot Password
          </Typography>

          <Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 0, mt: 2 }}>
              <TextField
                name="email"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                //   helperText={errors.email}
                fullWidth
                placeholder="Enter Email"
                variant="outlined"
                size="small"
                sx={{
                  //   boxShadow: 0,
                  //   borderRadius: 10,
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderTopLeftRadius: 4,
                      borderBottomLeftRadius: 4,
                      borderTopRightRadius: 0,
                      borderBottomRightRadius: 0,
                    },
                    "&:hover fieldset": {
                      borderColor: "#00BBD4",
                    },
                    "&.Mui-focused fieldset": {
                      borderWidth: 1,
                      borderColor: "#00BBD4",
                    },
                  },
                }}
              />
              <Button
                onClick={handleEmailSubmit}
                variant="contained"
                size="medium"
                sx={{
                  boxShadow: 0,
                  // height: '37px',
                  backgroundColor: "#00BBD4",
                  borderRadius: 0,
                  border: "1px solid #00BBD4",
                  borderTopRightRadius: "4px",
                  borderBottomRightRadius: "4px",
                  // borderTopLeftRadius: 0,
                  // borderBottomLeftRadius: 0,
                }}
                disabled={disableGo}
              >
                {loading ? <CircularProgress size="25px" /> : "Go"}
              </Button>
            </Box>
            <Typography
              sx={{
                fontFamily: "poppins",
                fontSize: "12px",
                textAlign: "start",
                color: "#DB2F2F",
                ml: 1.5,
                mt: 0.5,
                fontWeight: 100,
              }}
            >
              {errors.email}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2, mt: 2 }}>
            <TextField
              name="otp"
              value={formData.otp}
              onChange={handleChange}
              error={!!errors.otp}
              helperText={errors.otp}
              fullWidth
              placeholder="Enter OTP"
              variant="outlined"
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": {
                  "&:hover fieldset": {
                    borderColor: "#00BBD4",
                  },
                  "&.Mui-focused fieldset": {
                    borderWidth: 1,
                    borderColor: "#00BBD4",
                  },
                },
              }}
            />
          </Box>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Button
              onClick={handleOtpSubmit}
              variant="contained"
              sx={{ backgroundColor: "#00BBD4" }}
            >
              Submit
            </Button>
          </Box>
        </Grid>
      )}
    </Grid>
  );
};

export default ForgotPassword;
