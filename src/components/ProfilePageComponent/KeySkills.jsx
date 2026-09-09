import React from "react";
import { Typography, Box, Chip, Stack } from "@mui/material";

export default function KeySkills({ candidateData = {} }) {
  const skills = candidateData?.skills || candidateData?.key_skills || [];
  const skillList = Array.isArray(skills) ? skills : String(skills || "").split(",").filter(Boolean);

  return (
    <Box>
      <Typography variant="subtitle1" fontWeight={600}>Key Skills</Typography>
      <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mt: 1 }}>
        {skillList.length > 0 ? (
          skillList.map((skill, index) => <Chip key={`${skill}-${index}`} label={skill} />)
        ) : (
          <Typography variant="body2" color="text.secondary">No skills provided.</Typography>
        )}
      </Stack>
    </Box>
  );
}
