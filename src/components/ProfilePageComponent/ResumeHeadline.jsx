import React from "react";
import { Typography, Box } from "@mui/material";

export default function ResumeHeadline({ candidateData = {} }) {
  return (
    <Box>
      <Typography variant="subtitle1" fontWeight={600}>Resume Headline</Typography>
      <Typography variant="body2" color="text.secondary">
        {candidateData?.resume_headline || "No resume headline available."}
      </Typography>
    </Box>
  );
}
