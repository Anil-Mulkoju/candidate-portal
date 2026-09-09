import React from "react";
import { Typography, Box } from "@mui/material";

export default function ProfileSummaryPage({ candidateData = {} }) {
  return (
    <Box>
      <Typography variant="subtitle1" fontWeight={600}>Profile Summary</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        {candidateData?.profile_summary || "No profile summary available."}
      </Typography>
    </Box>
  );
}
