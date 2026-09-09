// src/pages/Candidate/register/candidateRegistration/candidateStepper/index.jsx

import React, { useState } from "react";
import { Box, Grid, Typography } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";

import EmploymentDetailsPage from "./employmentDetails";
import EducationalPage from "./educationDetails";
import PersonalDetails from "./personalDetails";

const PRIMARY        = "#2B6F71";
const BG_PAGE        = "#E9EAF0";
const TEXT_SECONDARY = "#9C9C9C";

const STEPS = [
  { label: "Work Experience",   sub: "Lorem Ipsum is simply" },
  { label: "Education Details", sub: "Lorem Ipsum is simply" },
  { label: "Personal details",  sub: "Lorem Ipsum is simply" },
];

const StepItem = ({ index, label, sub, status, isLast }) => {
  const isDone    = status === "done";
  const isActive  = status === "active";
  const isPending = status === "pending";

  const bgColor = isDone || isActive ? PRIMARY : "#FFFFFF";
  const textColor = isDone || isActive ? "#fff" : TEXT_SECONDARY;

  const clipPath = isLast
    ? index === 0
      ? "none"
      : "polygon(14px 0, 100% 0, 100% 100%, 14px 100%, 0 50%)"
    : index === 0
    ? "polygon(0 0, calc(100% - 14px) 0, 100% 50%, calc(100% - 14px) 100%, 0 100%)"
    : "polygon(14px 0, calc(100% - 14px) 0, 100% 50%, calc(100% - 14px) 100%, 14px 100%, 0 50%)";

  return (
    <Box
      sx={{
        flex: 1,
        clipPath,
        bgcolor: bgColor,
        border: isPending ? "1.5px solid #DDE1EA" : "none",
        display: "flex",
        alignItems: "center",
        gap: 1.2,
        px: index === 0 ? 2 : 3,
        pr: isLast ? 2 : 3,
        py: 1.25,
        minHeight: 56,
        ml: index === 0 ? 0 : "-2px",
        zIndex: isDone || isActive ? 2 : 1,
        transition: "background 0.2s",
      }}
    >
      <Box
        sx={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: isDone ? "#fff" : isActive ? "rgba(255,255,255,0.22)" : "#E9EAF0",
          color: isDone ? PRIMARY : isActive ? "#fff" : TEXT_SECONDARY,
          fontWeight: 700,
          fontSize: "0.78rem",
          border: isActive ? "2px solid rgba(255,255,255,0.5)" : "none",
        }}
      >
        {isDone ? <CheckIcon sx={{ fontSize: 15 }} /> : String(index + 1).padStart(2, "0")}
      </Box>

      <Box sx={{ minWidth: 0 }}>
        <Typography
          sx={{
            color: textColor,
            fontWeight: 700,
            fontSize: { xs: "0.7rem", sm: "0.84rem" },
            lineHeight: 1.25,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {label}
        </Typography>
        <Typography
          sx={{
            color: isDone || isActive ? "rgba(255,255,255,0.72)" : TEXT_SECONDARY,
            fontSize: { xs: "0.6rem", sm: "0.7rem" },
            lineHeight: 1.2,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {sub}
        </Typography>
      </Box>
    </Box>
  );
};

const TopStepper = ({ activeStep }) => (
  <Box
    sx={{
      display: "flex",
      width: "100%",
      borderRadius: "28px",
      overflow: "hidden",
      boxShadow: "0 2px 12px rgba(43,111,113,0.10)",
      mb: 3,
      bgcolor: "#fff",
    }}
  >
    {STEPS.map((step, i) => (
      <StepItem
        key={i}
        index={i}
        label={step.label}
        sub={step.sub}
        status={i < activeStep ? "done" : i === activeStep ? "active" : "pending"}
        isLast={i === STEPS.length - 1}
      />
    ))}
  </Box>
);

const CandidateStepper = () => {
  const [activeStep, setActiveStep] = useState(0);

  const handleNext      = () => setActiveStep((p) => Math.min(p + 1, STEPS.length - 1));
  const handleBack      = () => setActiveStep((p) => Math.max(p - 1, 0));
  const handleStepClick = (step) => setActiveStep(step);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: BG_PAGE, py: { xs: 2, sm: 4 }, px: { xs: 1, sm: 2 } }}>
      <Grid container justifyContent="center">
        <Grid item xs={12} sm={11} md={10} lg={9} xl={8}>

          <TopStepper activeStep={activeStep} />

          {activeStep === 0 && (
            <EmploymentDetailsPage
              activeStep={activeStep}
              handleNext={handleNext}
              handleBack={handleBack}
              handleStepClick={handleStepClick}
            />
          )}
          {activeStep === 1 && (
            <EducationalPage
              activeStep={activeStep}
              handleNext={handleNext}
              handleBack={handleBack}
              handleStepClick={handleStepClick}
            />
          )}
          {activeStep === 2 && (
            <PersonalDetails
              activeStep={activeStep}
              handleBack={handleBack}
              handleStepClick={handleStepClick}
            />
          )}

        </Grid>
      </Grid>
    </Box>
  );
};

export default CandidateStepper;