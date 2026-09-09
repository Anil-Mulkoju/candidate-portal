import React from "react";
import { Typography, Box } from "@mui/material";

export default function Employement({ candidateData = {} }) {
  const employments = candidateData?.employment || [];

  return (
    <Box>
      <Typography variant="subtitle1" fontWeight={600}>Employment</Typography>
      {employments.length > 0 ? (
        employments.map((item, index) => (
          <Typography key={`${item?.company_name || index}-${index}`} variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {item?.company_name || "Company"}
          </Typography>
        ))
      ) : (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          No employment details provided.
        </Typography>
      )}
    </Box>
  );
}
