import React from "react";
import { Typography, Box } from "@mui/material";

export default function CareerProfile({ candidateData = {} }) {
  return (
    <Box>
      <Typography variant="subtitle1" fontWeight={600}>Career Profile</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        {candidateData?.career_profile || "No career profile available."}
      </Typography>
    </Box>
  );
}
