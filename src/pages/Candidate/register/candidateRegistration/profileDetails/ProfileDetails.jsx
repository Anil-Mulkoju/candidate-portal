import React, { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import EmploymentDetailsPage from "../candidateStepper/employmentDetails/index.jsx";
import EducationalPage from "../candidateStepper/educationDetails/index.jsx";
import PersonalDetails from "../candidateStepper/personalDetails/index.jsx";
import { AppContext } from "../../../../../AppContext";
import { Grid } from "@mui/material";
import StepperComponent from "../../../../../components/Stepper/index.jsx";

export default function CandidateProfileDetails() {
  const location = useLocation();
  const { setLoading, formData = {}, setFormData } = useContext(AppContext);
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    console.log(
      "UserDetails: handleNext called, moving to step",
      activeStep + 1
    );
    setActiveStep((prev) => prev + 1);
  };
  const handleBack = () => {
    console.log(
      "UserDetails: handleBack called, moving to step",
      activeStep - 1
    );
    setActiveStep((prev) => prev - 1);
  };
  const handleStepClick = (index) => {
    console.log("UserDetails: handleStepClick called with index:", index);
    setActiveStep(index);
  };

  return (
    <Grid
      container
      justifyContent="center"
      // alignItems="center"
      // sx={{
      //   // mt: { xs: 0, sm: 15 },
      //   // minHeight: { xs: "auto", sm: "100vh" },
      //   // p: { xs: 2, sm: 4 },
      // }}
    >
      <Grid sx={{ display: "flex" }} item xs={12} sm={10} md={8} lg={6}>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 4,
            flex: 2,
          }}
        >
          {activeStep === 0 && (
            <EmploymentDetailsPage
              handleNext={handleNext}
              handleBack={handleBack}
              activeStep={activeStep}
              handleStepClick={handleStepClick}
            />
          )}
          {activeStep === 1 && (
            <EducationalPage
              handleNext={handleNext}
              handleBack={handleBack}
              activeStep={activeStep}
              handleStepClick={handleStepClick}
            />
          )}
          {activeStep === 2 && (
            <PersonalDetails
              handleNext={handleNext}
              handleBack={handleBack}
              activeStep={activeStep}
              handleStepClick={handleStepClick}
            />
          )}
        </Box>
      </Grid>
    </Grid>
  );
}
