import React from "react";
import { Typography, Box } from "@mui/material";

export default function PersonalDetails({ candidateData = {} }) {
  return (
    <Box>
      <Typography variant="subtitle1" fontWeight={600}>Personal Details</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        {candidateData?.full_name || "No personal details available."}
      </Typography>
    </Box>
  );
}
