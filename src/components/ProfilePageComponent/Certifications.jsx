import React from "react";
import { Typography, Box } from "@mui/material";

export default function Certifications({ candidateData = {} }) {
  const certifications = candidateData?.certifications || [];

  return (
    <Box>
      <Typography variant="subtitle1" fontWeight={600}>Certifications</Typography>
      {certifications.length > 0 ? (
        certifications.map((item, index) => (
          <Typography key={`${item?.name || index}-${index}`} variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {item?.name || "Certification"}
          </Typography>
        ))
      ) : (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          No certifications provided.
        </Typography>
      )}
    </Box>
  );
}
