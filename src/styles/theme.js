import { createTheme, responsiveFontSizes } from "@mui/material/styles";

export const COLORS = {
  // Hiring Manager Colors
  navyBlue: "#1F242F",
  royalBlue: "#174FDF",
  skyBlue: "#1750dff6",
  accentCyan: "#00BBD4",

  primaryLight: "#EEF4FF",
  primaryBorder: "#C7D2FE",

  successLight: "#E8F5E9",
  warningBorder: "#FFE0B2",

  shadow: "rgba(23,79,223,0.08)",

  success: "#4CAF50",
  warning: "#FF9800",
  warningLight: "#FFF3E0",
  error: "#F44336",
  errorLight: "#FFEBEE",
  info: "#2196F3",
  infoLight: "#E3F2FD",

  bgPage: "#F4F6FB",
  bgCard: "#FFFFFF",
  border: "#E8ECF4",
  textPrimary: "#1F242F",
  textSecondary: "#6B7280",
  textMuted: "#9CA3AF",

  // Dashboard pipeline and interview statuses. These are intentionally
  // distinct so status charts, chips, and legends are easy to scan.
  dashboard: {
    matched: "#2563EB",
    shortlisted: "#8B5CF6",
    interviewing: "#F59E0B",
    selected: "#14B8A6",
    onboarded: "#16A34A",
    scheduled: "#EC4899",
    rescheduled: "#06B6D4",
    completed: "#059669",
    cancelled: "#64748B",
  },

  // Candidate Colors
  candidatePrimary: "#2B6F71",
  candidatePrimaryLight: "#D8ECEC",
  candidateBgPage: "#E9EAF0",
  candidateBgCard: "#FFFFFF",
  candidateTextPrimary: "#1F242F",
  candidateTextSecondary: "#9C9C9C",
  candidateTextMuted: "#B5B5B5",
  candidateBorder: "#DDE1EA",
  candidateShadow: "rgba(43,111,113,0.08)",
};

// ── Employer dashboard status colors ────────────────────────────────────────
// One color per candidate/job status, used everywhere that status shows up:
// stat-card icons, stage chips, chart series, and the pipeline funnel.
const hexToRgba = (hex, alpha) => {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const withTint = (color) => ({ color, bg: hexToRgba(color, 0.14) });

export const STATUS_COLORS = {
  matched: {
    ...withTint("#6d8bb4"),
    label: "Matched",
    description: "Initial stage / Neutral",
  },
  shortlisted: {
    ...withTint("#2563EB"),
    label: "Shortlisted",
    description: "Candidate has been positively identified",
  },
  interviewing: {
    ...withTint("#7C3AED"),
    label: "Interview",
    description: "Active evaluation stage",
  },
  selected: {
    ...withTint("#16A34A"),
    label: "Selected",
    description: "Successfully cleared interviews",
  },
  offer_released: {
    ...withTint("#D97706"),
    label: "Offer Released",
    description: "Waiting on candidate response",
  },
  offer_accepted: {
    ...withTint("#059669"),
    label: "Offer Accepted",
    description: "Positive confirmation",
  },
  offer_revoked: {
    ...withTint("#C2410C"),
    label: "Offer Revoked",
    description: "Offer withdrawn by employer",
  },
  offer_rejected: {
    ...withTint("#EA580C"),
    label: "Offer Rejected",
    description: "Candidate declined the offer",
  },
  onboarded: {
    ...withTint("#15803D"),
    label: "Onboarded",
    description: "Final successful state",
  },
  rejected: { ...withTint("#DC2626"), label: "Rejected", description: "" },
  on_hold: {
    ...withTint("#F59E0B"),
    label: "On Hold",
    description: "Paused — not moving through the pipeline until resumed",
  },
};

// Individual interview-round status chips — round-level outcomes
// (scheduled/completed/cancelled/etc.) aren't covered by STATUS_COLORS above,
// which only tracks the candidate's overall stage. Used by Timeline.jsx's
// getStatusTheme() and by dashboard/index.jsx's INTERVIEW_STATUS_META.
export const INTERVIEW_ROUND_STATUS_COLORS = {
  scheduled: {
    ...withTint("#2563EB"),
    label: "Scheduled",
    description: "Planned",
  },
  completed: {
    ...withTint("#16A34A"),
    label: "Completed",
    description: "Successfully conducted",
  },
  rescheduled: {
    ...withTint("#D97706"),
    label: "Rescheduled",
    description: "Schedule changed",
  },
  cancelled: {
    ...withTint("#6B7280"),
    label: "Cancelled",
    description: "Neutral cancellation",
  },
  "no show": {
    ...withTint("#DC2626"),
    label: "No Show",
    description: "Candidate/interviewer absent",
  },
  "not conducted": {
    color: "#757575",
    bg: "#F5F5F5",
    label: "Not Conducted",
    description: "",
  },
};

const themeBase = createTheme({
  spacing: 8,

  palette: {
    primary: {
      main: COLORS.royalBlue,
      light: COLORS.skyBlue,
      dark: "#1237A3",
    },

    secondary: {
      main: "#F97316",
    },

    background: {
      default: COLORS.bgPage,
      paper: COLORS.bgCard,
    },

    text: {
      primary: COLORS.textPrimary,
      secondary: COLORS.textSecondary,
    },
  },

  // Custom colors
  colors: {
    hiring: {
      primary: COLORS.royalBlue,
      primaryLight: COLORS.primaryLight,
      bgPage: COLORS.bgPage,
      bgCard: COLORS.bgCard,
      border: COLORS.border,
      textPrimary: COLORS.textPrimary,
      textSecondary: COLORS.textSecondary,
      textMuted: COLORS.textMuted,
      shadow: COLORS.shadow,
    },

    candidate: {
      primary: COLORS.candidatePrimary,
      primaryLight: COLORS.candidatePrimaryLight,
      bgPage: COLORS.candidateBgPage,
      bgCard: COLORS.candidateBgCard,
      border: COLORS.candidateBorder,
      textPrimary: COLORS.candidateTextPrimary,
      textSecondary: COLORS.candidateTextSecondary,
      textMuted: COLORS.candidateTextMuted,
      shadow: COLORS.candidateShadow,
    },
  },

  typography: {
    fontFamily: "'Nunito Sans', sans-serif",

    h1: { fontSize: "2.25rem", fontWeight: 700, lineHeight: 1.2 },
    h2: { fontSize: "1.875rem", fontWeight: 700, lineHeight: 1.25 },
    h3: { fontSize: "1.5rem", fontWeight: 600 },
    h4: { fontSize: "1.25rem", fontWeight: 600 },
    h5: { fontSize: "1.125rem", fontWeight: 600 },
    h6: { fontSize: "1rem", fontWeight: 600 },

    subtitle1: { fontSize: "1rem", fontWeight: 500 },
    subtitle2: { fontSize: "0.875rem", fontWeight: 500 },

    body1: { fontSize: "1rem", fontWeight: 400 },
    body2: { fontSize: "0.875rem", fontWeight: 400 },

    button: {
      textTransform: "none",
      fontWeight: 600,
      fontSize: "0.95rem",
    },

    caption: {
      fontSize: "0.75rem",
      fontWeight: 400,
    },
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          fontFamily: "'Nunito Sans', sans-serif",
          fontSize: "1rem",
          lineHeight: 1.6,
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8,
          fontWeight: 600,
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 2px 12px rgba(8,145,178,0.07)",
        },
      },
    },
  },
});

const theme = responsiveFontSizes(themeBase);

export default theme;
