import React from "react";
import { Typography, Box } from "@mui/material";

export default function ProjectsComponent({ candidateData = {} }) {
  return (
    <Box>
      <Typography variant="subtitle1" fontWeight={600}>Projects</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        {candidateData?.projects?.length ? "Projects data available." : "No projects provided."}
      </Typography>
    </Box>
  );
}
