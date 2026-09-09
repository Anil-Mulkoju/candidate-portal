import React from "react";
import { Typography, Box } from "@mui/material";

export default function Education({ candidateData = {} }) {
  const education = candidateData?.education || [];

  return (
    <Box>
      <Typography variant="subtitle1" fontWeight={600}>Education</Typography>
      {education.length > 0 ? (
        education.map((item, index) => (
          <Typography key={`${item?.institution || index}-${index}`} variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {item?.degree || item?.qualification || "Education entry"}
          </Typography>
        ))
      ) : (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          No education details provided.
        </Typography>
      )}
    </Box>
  );
}
