import React, { useState, useContext } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  InputAdornment,
  Grid,
} from "@mui/material";
import { AppContext } from "../../../../../../AppContext";
import StepperComponent from "../../../../../../components/Stepper/index.jsx";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { candidateUpdateFormData } from "../../../../../../store/slices/candidateSlice";
 
const BasicDetails = ({ handleNext, activeStep, handleStepClick }) => {
  const { formData = {}, setFormData } = useContext(AppContext);
  const dispatch = useDispatch();
  const candidateDetails = useSelector(
    (state) => state?.candidate?.formData?.candidateDetails || {}
  );
 
  const getFlagIcon = (countryCode) => {
    if (countryCode === "+1") {
      return (
        <svg
          width="24"
          height="16"
          viewBox="0 0 24 16"
          style={{ marginRight: "8px" }}
        >
          <rect x="0" y="0" width="24" height="16" fill="#B22234" />
          <rect x="0" y="0" width="24" height="1.23" fill="#FFFFFF" />
          <rect x="0" y="2.46" width="24" height="1.23" fill="#FFFFFF" />
          <rect x="0" y="4.92" width="24" height="1.23" fill="#FFFFFF" />
          <rect x="0" y="7.38" width="24" height="1.23" fill="#FFFFFF" />
          <rect x="0" y="9.84" width="24" height="1.23" fill="#FFFFFF" />
          <rect x="0" y="12.3" width="24" height="1.23" fill="#FFFFFF" />
          <rect x="0" y="0" width="9.6" height="8.62" fill="#3C3B6E" />
          {Array.from({ length: 50 }, (_, i) => (
            <circle
              key={i}
              cx={1 + (i % 10) * 0.96}
              cy={1 + Math.floor(i / 10) * 1.72}
              r="0.2"
              fill="#FFFFFF"
            />
          ))}
        </svg>
      );
    } else if (countryCode === "+91") {
      return (
        <svg
          width="24"
          height="16"
          viewBox="0 0 24 16"
          style={{ marginRight: "8px" }}
        >
          <rect x="0" y="0" width="24" height="5.33" fill="#FF9933" />
          <rect x="0" y="5.33" width="24" height="5.33" fill="#FFFFFF" />
          <rect x="0" y="10.66" width="24" height="5.33" fill="#138808" />
          <circle cx="12" cy="8" r="2" fill="#000080" />
        </svg>
      );
    }
    return null;
  };
 
  const [localData, setLocalData] = useState({
    first_name: candidateDetails.first_name || "",
    last_name: candidateDetails.last_name || "",
    email: candidateDetails.email || "",
    phone_number: candidateDetails.phone_number || "",
  });
  const [errors, setErrors] = useState({});
 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: false }));
  };
 
  const validateForm = () => {
    const newErrors = {
      first_name: !localData.first_name?.trim?.(),
      last_name: !localData.last_name?.trim?.(),
      email:
        !localData.email?.trim?.() ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(localData.email),
    };
 
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };
 
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const updatedData = { ...localData, country_code: candidateDetails.country_code };
      dispatch(candidateUpdateFormData({ section: "basicDetails", updates: updatedData }));
      console.log("Basic Details saved:", updatedData);
      handleNext();
    }
  };
 
  return (
    <Grid>
      <Box
        sx={{
          p: { xs: 2, sm: 3, md: 4, lg: 5, xl: 6 },
          maxWidth: { xs: "100%", sm: "90%", md: 600, lg: 700, xl: 800 },
          width: { xs: "100%", sm: "auto" },
          margin: "auto",
          boxShadow: { xs: 1, sm: 2, md: 3, lg: 3, xl: 4 },
          borderRadius: { xs: 1, sm: 2 },
          mt: { xs: 8, sm: 10, md: 12, lg: 8, xl: 10 },
          background: "#fff",
          position: "relative",
          top: 0,
        }}
      >
        <StepperComponent
          activeStep={activeStep}
          handleStepClick={handleStepClick}
        />
 
        <Typography
          variant="h5"
          sx={{
            pb: { xs: 1, sm: 1.5, lg: 2, xl: 2 },
            textAlign: "center",
            mt: { xs: 2, sm: 3, md: 4, lg: 0.5, xl: 1 },
            fontSize: {
              xs: "1rem",
              sm: "1.1rem",
              md: "1.2rem",
              lg: "1.3rem",
              xl: "1.4rem",
            },
            fontWeight: 500,
          }}
        >
          Basic Details
        </Typography>
 
        <Box component="form" onSubmit={handleSubmit}>
          {/* Name fields */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: { xs: 1.5, sm: 2, md: 2.5, lg: 3, xl: 4 },
              mb: { xs: 1.5, sm: 2, md: 2.5, lg: 3, xl: 3 },
            }}
          >
            <TextField
              fullWidth
              size="small"
              name="first_name"
              label="First Name"
              value={localData.first_name}
              onChange={handleChange}
              error={!!errors.first_name}
              helperText={errors.first_name && "First name is required"}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: { xs: "8px", sm: "10px" },
                  background: "#FFFFFF",
                  "& fieldset": { borderColor: "grey.400" },
                  "&:hover fieldset": { borderColor: "#00BBD4" },
                  "&.Mui-focused fieldset": { borderColor: "#00BBD4" },
                  "&.Mui-disabled fieldset": { borderColor: "grey.400" },
                },
                "& .MuiInputLabel-root": { color: "#ADAEBC" },
                "& .MuiInputLabel-root.Mui-focused": { color: "#00BBD4" },
                "& input": { fontSize: { xs: "14px", sm: "16px" } },
              }}
            />
            <TextField
              fullWidth
              size="small"
              name="last_name"
              label="Last Name"
              value={localData.last_name}
              onChange={handleChange}
              error={!!errors.last_name}
              helperText={errors.last_name && "Last name is required"}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: { xs: "8px", sm: "10px" },
                  background: "#FFFFFF",
                  "& fieldset": { borderColor: "grey.400" },
                  "&:hover fieldset": { borderColor: "#00BBD4" },
                  "&.Mui-focused fieldset": { borderColor: "#00BBD4" },
                  "&.Mui-disabled fieldset": { borderColor: "grey.400" },
                },
                "& .MuiInputLabel-root": { color: "#ADAEBC" },
                "& .MuiInputLabel-root.Mui-focused": { color: "#00BBD4" },
                "& input": { fontSize: { xs: "14px", sm: "16px" } },
              }}
            />
          </Box>
 
          <TextField
            fullWidth
            size="small"
            name="email"
            label="Email"
            value={localData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email && "Enter a valid email"}
            disabled
            sx={{
              mb: { xs: 1.5, sm: 2, md: 2.5, lg: 3, xl: 3 },
              "& .MuiOutlinedInput-root": {
                borderRadius: { xs: "8px", sm: "10px" },
                background: "#FFFFFF",
                "& fieldset": { borderColor: "grey.400" },
                "&:hover fieldset": { borderColor: "#00BBD4" },
                "&.Mui-focused fieldset": { borderColor: "#00BBD4" },
                "&.Mui-disabled fieldset": { borderColor: "grey.400" },
              },
              "& .MuiInputLabel-root": { color: "#ADAEBC" },
              "& .MuiInputLabel-root.Mui-focused": { color: "#00BBD4" },
              "& input": { fontSize: { xs: "14px", sm: "16px" } },
              "& .Mui-disabled": {
                background: "#F5F5F5",
                "& input": { color: "#666666", WebkitTextFillColor: "#666666" },
              },
            }}
          />
 
          <TextField
            fullWidth
            size="small"
            name="phone_number"
            label="Phone Number"
            value={localData.phone_number}
            onChange={handleChange}
            error={!!errors.phone_number}
            helperText={errors.phone_number && "Phone number is required"}
            disabled
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  {getFlagIcon(candidateDetails.country_code)}
                </InputAdornment>
              ),
            }}
            sx={{
              mb: { xs: 1.5, sm: 2, md: 2.5, lg: 3, xl: 3 },
              "& .MuiOutlinedInput-root": {
                borderRadius: { xs: "8px", sm: "10px" },
                background: "#FFFFFF",
                "& fieldset": { borderColor: "grey.400" },
                "&:hover fieldset": { borderColor: "#00BBD4" },
                "&.Mui-focused fieldset": { borderColor: "#00BBD4" },
                "&.Mui-disabled fieldset": { borderColor: "grey.400" },
              },
              "& .MuiInputLabel-root": { color: "#ADAEBC" },
              "& .MuiInputLabel-root.Mui-focused": { color: "#00BBD4" },
              "& input": { fontSize: { xs: "14px", sm: "16px" } },
              "& .Mui-disabled": {
                background: "#F5F5F5",
                "& input": { color: "#666666", WebkitTextFillColor: "#666666" },
              },
            }}
          />
 
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              mt: { xs: 1.5, sm: 2, md: 2.5, lg: 3, xl: 4 },
            }}
          >
            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: "#00BBD4",
                color: "#fff",
                "&:hover": { backgroundColor: "#009FB5" },
              }}
            >
              Save and Continue
            </Button>
          </Box>
        </Box>
      </Box>
    </Grid>
  );
};
 
BasicDetails.propTypes = {
  handleNext: PropTypes.func.isRequired,
  activeStep: PropTypes.number.isRequired,
  handleStepClick: PropTypes.func.isRequired,
};
 
BasicDetails.defaultProps = {
  handleStepClick: () =>
    console.warn("BasicDetails: handleStepClick not provided"),
};
 
export default BasicDetails;