// src/components/StepPageLayout/index.jsx
import React from "react";
import { Box, Grid } from "@mui/material";
import PropTypes from "prop-types";
import StepperComponent from "../Stepper/index.jsx";

const PAGE_WIDTH = { xl: 1000, lg: 900, md: 750, sm: 600, xs: "100%" };

const StepPageLayout = ({ activeStep, handleStepClick, children, minHeight }) => {
  return (
    <Grid container justifyContent="center">
      <Grid
        item
        size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}
        gap={3.5}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          p: { xs: 1, sm: 4, md: 4, lg: 4, xl: 0 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <Box sx={{ width: PAGE_WIDTH }}>
            <StepperComponent
              activeStep={activeStep}
              handleStepClick={handleStepClick}
              maxWidth="100%"
            />
          </Box>
        </Box>

        <Box
          sx={{
            boxShadow: "0 2px 12px rgba(43,111,113,0.08)",
            borderRadius: 2,
            background: "#fff",
            p: { xs: 2, sm: 4 },
            width: PAGE_WIDTH,
            minHeight: minHeight ?? {
              xl: 640,
              lg: 500,
              md: 500,
              sm: "auto",
              xs: "auto",
            },
            display: "flex",
            flexDirection: "column",
          }}
        >
          {children}
        </Box>
      </Grid>
    </Grid>
  );
};

StepPageLayout.propTypes = {
  activeStep: PropTypes.number.isRequired,
  handleStepClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  minHeight: PropTypes.oneOfType([PropTypes.object, PropTypes.string, PropTypes.number]),
};

export default StepPageLayout;