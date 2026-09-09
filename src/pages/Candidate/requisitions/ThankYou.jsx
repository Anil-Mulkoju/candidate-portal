import React from "react";
import { Box, Typography, Button } from "@mui/material";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";

const INK = "#1F2937";
const TEXT_MUTED = "#6B7280";
const PRIMARY = "#2B6F71";
const PRIMARY_DARK = "#1E4F50";
const PRIMARY_TINT = "#EAF5F4";
const SURFACE = "#F8FAF9";
const BORDER = "#E1E5E7";

const FONT_DISPLAY = "'Georgia', 'Times New Roman', serif";

/* ── Shown after a candidate successfully applies to a job ── */
const ThankYou = ({ job, onBackToList }) => (
  <Box
    sx={{
      background: SURFACE,
      border: `1px solid ${BORDER}`,
      borderRadius: "14px",
      p: { xs: 4, sm: 6 },
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center",
      gap: 1.5,
    }}
  >
    <Box
      sx={{
        width: 64,
        height: 64,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: PRIMARY_TINT,
        color: PRIMARY_DARK,
        mb: 1,
      }}
    >
      <CheckCircleRoundedIcon sx={{ fontSize: 34 }} />
    </Box>

    <Typography sx={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 24, color: INK }}>
      Application Submitted
    </Typography>

    <Typography sx={{ fontSize: 14, color: TEXT_MUTED, maxWidth: 420, lineHeight: 1.7 }}>
      Thanks for applying{job?.job_title ? ` to "${job.job_title}"` : ""}
      {job?.organisation?.organisation_name ? ` at ${job.organisation.organisation_name}` : ""}. The hiring
      team will review your profile and reach out if there's a match.
    </Typography>

    <Button
      onClick={onBackToList}
      startIcon={<ArrowBackRoundedIcon sx={{ fontSize: 18 }} />}
      sx={{
        textTransform: "none",
        fontWeight: 700,
        fontSize: 13.5,
        borderRadius: "10px",
        px: 3,
        py: 1,
        mt: 2,
        color: "#fff",
        bgcolor: PRIMARY,
        "&:hover": { bgcolor: PRIMARY_DARK },
      }}
    >
      Back to Requisitions
    </Button>
  </Box>
);

export default ThankYou;