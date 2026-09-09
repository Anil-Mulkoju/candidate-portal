import React, { useEffect, useState } from "react";
import {
  Breadcrumbs,
  Box,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Fade,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

// ======================
// Constants
// ======================

/**
 * Navigation direction values for animation
 */
const NAVIGATION_DIRECTION = {
  LEFT: "left",
  RIGHT: "right",
  NONE: "none",
};

/**
 * Breadcrumb segment label mappings
 */
const BREADCRUMB_LABEL_MAP = {
  dashboard: "Dashboard",
  requisitions: "Requisitions",
  interviews: "Interviews",
  "view-profile-details": "Matched Candidate Profile",
  "matched-candidates": "Matched Candidates",
  candidates: "Candidates",
  settings: "Settings",
  "profile-details": "Profile Details",
  "user-management": "User Management",
  organization: "Organization",
  department: "Department",
  billingdetails: "Billing Details",
  "change-password": "Change Password",
  "create-job": "Create Job",
  "job-requirements": "Job Requirements",
  "job-details": "Job Details",
  feedback: "Feedback",
  summary: "Summary",
  timeline: "Timeline",
  interview: "Interview",
  pipeline: "Pipeline",
  details: "Details",
};

/**
 * Route segments that only exist as parent containers with no index
 * route of their own (see src/App.jsx). Navigating straight to them
 * renders an empty page, so they must never be rendered as a link
 * when they appear as an intermediate (non-current) crumb.
 */
const NON_NAVIGABLE_SEGMENTS = new Set(["settings", "create-job"]);

/**
 * Default label for UUID segments
 */
const UUID_SEGMENT_DEFAULT_LABEL = "Interview Details";

/**
 * Base recruit route path
 */
const BASE_RECRUIT_PATH = "/recruit";

/**
 * Default home navigation path
 */
const DEFAULT_HOME_PATH = "/recruit/dashboard";

/**
 * Animation configuration
 */
const ANIMATION_CONFIG = {
  FADE_TIMEOUT: 180,
  TRANSFORM_OFFSET_PX: 6,
  TRANSFORM_TRANSITION_MS: "180ms",
};

/**
 * Styling constants
 */
const STYLE_CONSTANTS = {
  PADDING_X: 1.5,
  PADDING_Y: 0.75,
  Z_INDEX: 10,
  FONT_SIZE_BREADCRUMB: "15px",
  FONT_SIZE_SEPARATOR: 16,
  FONT_SIZE_CHIP_ICON: 12,
  FONT_SIZE_NAV_ICON: 11,
  CHIP_FONT_SIZE: "12px",
  TYPOGRAPHY_FONT_SIZE: 13,
  TYPOGRAPHY_FONT_WEIGHT: 700,
  ICON_GAP: 0.4,
  NAV_BUTTON_SIZE: 24,

  // Brand palette — kept in one place so every crumb state
  // (link / hover / current / disabled) draws from the same source.
  BRAND_PRIMARY: "#00A1A7",
  BRAND_PRIMARY_SOFT_BG: "rgba(0, 161, 167, 0.08)",
  BRAND_PRIMARY_SOFT_BG_HOVER: "rgba(0, 161, 167, 0.16)",
  SEPARATOR_COLOR: "#9CA3AF",
  MUTED_TEXT_COLOR: "#475569",
  DISABLED_TEXT_COLOR: "#94A3B8",
  CURRENT_TEXT_COLOR: "#0F172A",
};

/**
 * UUID pattern regex
 */
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// ======================
// Utility Functions
// ======================

/**
 * Validates if a string is a valid UUID
 * @param {string} value - The value to validate
 * @returns {boolean} True if value is a valid UUID
 */
const isValidUUID = (value) => UUID_PATTERN.test(value);

/**
 * Converts a raw route segment (e.g. "user-management") into
 * Title Case ("User Management") for segments missing from
 * BREADCRUMB_LABEL_MAP.
 * @param {string} segment - The raw route segment
 * @returns {string} Title-cased, space-separated label
 */
const toTitleCase = (segment) =>
  segment
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

export default function AppBreadcrumbs() {
  const location = useLocation();
  const navigate = useNavigate();

  // State for breadcrumb navigation animation direction
  const [navigationDirection, setNavigationDirection] = useState(
    NAVIGATION_DIRECTION.NONE
  );

  // ====================================
  // Compute derived values
  // ====================================
  const pathSegments = location.pathname
    .split("/")
    .filter(Boolean)
    .slice(1);

  const currentHistoryIndex = window.history.state?.idx ?? 0;
  const canNavigateBackward = currentHistoryIndex > 0;
  const canNavigateForward = currentHistoryIndex < window.history.length - 1;

  const goBack = () => {
    if (!canNavigateBackward) return;
    setNavigationDirection(NAVIGATION_DIRECTION.LEFT);
    navigate(-1);
  };

  const goForward = () => {
    if (!canNavigateForward) return;
    setNavigationDirection(NAVIGATION_DIRECTION.RIGHT);
    navigate(1);
  };

  // ====================================
  // Keyboard shortcuts effect
  // ====================================
  useEffect(() => {
    const handleKeyboardNavigation = (event) => {
      if (!event.altKey) return;

      if (event.key === "ArrowLeft") goBack();
      if (event.key === "ArrowRight") goForward();
    };

    window.addEventListener("keydown", handleKeyboardNavigation);
    return () =>
      window.removeEventListener("keydown", handleKeyboardNavigation);
  }, [navigate, canNavigateBackward, canNavigateForward]);

  // ====================================
  // Reset animation on route change
  // ====================================
  useEffect(() => {
    setNavigationDirection(NAVIGATION_DIRECTION.NONE);
  }, [location.pathname]);

  // ====================================
  // Early return when no path segments
  // ====================================
  if (pathSegments.length === 0) return null;

  // ====================================
  // Transform offset calculation
  // ====================================
  const getTransformOffset = () => {
    if (navigationDirection === NAVIGATION_DIRECTION.LEFT) {
      return `-${ANIMATION_CONFIG.TRANSFORM_OFFSET_PX}px`;
    }
    if (navigationDirection === NAVIGATION_DIRECTION.RIGHT) {
      return `${ANIMATION_CONFIG.TRANSFORM_OFFSET_PX}px`;
    }
    return "0";
  };

  return (
    <Fade in timeout={ANIMATION_CONFIG.FADE_TIMEOUT}>
      <Box
        sx={{
          px: STYLE_CONSTANTS.PADDING_X,
          py: STYLE_CONSTANTS.PADDING_Y,
          position: "sticky",
          top: 0,
          zIndex: STYLE_CONSTANTS.Z_INDEX,
          display: { xs: "none", sm: "inline-flex" },
          alignItems: "center",
          width: "fit-content",
          whiteSpace: "nowrap",
          gap: 1,
          fontSize: STYLE_CONSTANTS.FONT_SIZE_BREADCRUMB,
          transform: getTransformOffset(),
          transition: `transform ${ANIMATION_CONFIG.TRANSFORM_TRANSITION_MS} ease`,
        }}
      >
        {/* Back / Forward history navigation */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.25 }}>
          <Tooltip title="Back (Alt + ←)">
            <span>
              <IconButton
                size="small"
                onClick={goBack}
                disabled={!canNavigateBackward}
                sx={{
                  width: STYLE_CONSTANTS.NAV_BUTTON_SIZE,
                  height: STYLE_CONSTANTS.NAV_BUTTON_SIZE,
                  color: canNavigateBackward
                    ? STYLE_CONSTANTS.MUTED_TEXT_COLOR
                    : STYLE_CONSTANTS.DISABLED_TEXT_COLOR,
                  "&:hover": {
                    bgcolor: STYLE_CONSTANTS.BRAND_PRIMARY_SOFT_BG,
                    color: STYLE_CONSTANTS.BRAND_PRIMARY,
                  },
                }}
              >
                <ArrowBackIosNewIcon
                  sx={{ fontSize: STYLE_CONSTANTS.FONT_SIZE_NAV_ICON }}
                />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Forward (Alt + →)">
            <span>
              <IconButton
                size="small"
                onClick={goForward}
                disabled={!canNavigateForward}
                sx={{
                  width: STYLE_CONSTANTS.NAV_BUTTON_SIZE,
                  height: STYLE_CONSTANTS.NAV_BUTTON_SIZE,
                  color: canNavigateForward
                    ? STYLE_CONSTANTS.MUTED_TEXT_COLOR
                    : STYLE_CONSTANTS.DISABLED_TEXT_COLOR,
                  "&:hover": {
                    bgcolor: STYLE_CONSTANTS.BRAND_PRIMARY_SOFT_BG,
                    color: STYLE_CONSTANTS.BRAND_PRIMARY,
                  },
                }}
              >
                <ArrowForwardIosIcon
                  sx={{ fontSize: STYLE_CONSTANTS.FONT_SIZE_NAV_ICON }}
                />
              </IconButton>
            </span>
          </Tooltip>
        </Box>

        <Breadcrumbs
          separator={
            <NavigateNextIcon
              sx={{
                fontSize: STYLE_CONSTANTS.FONT_SIZE_SEPARATOR,
                color: STYLE_CONSTANTS.SEPARATOR_COLOR,
              }}
            />
          }
          sx={{
            "& .MuiBreadcrumbs-ol": { alignItems: "center" },
            "& .MuiBreadcrumbs-li": {
              display: "flex",
              alignItems: "center",
            },
          }}
        >
          {/* Home button */}
          <Chip
            icon={
              <HomeIcon
                sx={{
                  fontSize: STYLE_CONSTANTS.FONT_SIZE_CHIP_ICON,
                  color: "inherit !important",
                }}
              />
            }
            label="Home"
            size="small"
            onClick={() => navigate(DEFAULT_HOME_PATH)}
            sx={{
              bgcolor: "transparent",
              color: STYLE_CONSTANTS.MUTED_TEXT_COLOR,
              fontSize: STYLE_CONSTANTS.CHIP_FONT_SIZE,
              fontWeight: 600,
              cursor: "pointer",
              "&:hover": {
                bgcolor: STYLE_CONSTANTS.BRAND_PRIMARY_SOFT_BG,
                color: STYLE_CONSTANTS.BRAND_PRIMARY,
              },
            }}
          />

          {pathSegments.map((segment, index) => {
            const segmentPath = `${BASE_RECRUIT_PATH}/${pathSegments
              .slice(0, index + 1)
              .join("/")}`;

            const isLastSegment = index === pathSegments.length - 1;
            const isNavigable = !NON_NAVIGABLE_SEGMENTS.has(
              segment.toLowerCase()
            );

            const breadcrumbLabel =
              BREADCRUMB_LABEL_MAP[segment.toLowerCase()] ||
              (isValidUUID(segment)
                ? UUID_SEGMENT_DEFAULT_LABEL
                : toTitleCase(segment));

            return (
              <Box
                key={segmentPath}
                display="flex"
                alignItems="center"
                gap={STYLE_CONSTANTS.ICON_GAP}
              >
                {isLastSegment ? (
                  <Typography
                    aria-current="page"
                    sx={{
                      px: 1,
                      py: 0.4,
                      borderRadius: "16px",
                      bgcolor: STYLE_CONSTANTS.BRAND_PRIMARY_SOFT_BG,
                      fontSize: STYLE_CONSTANTS.TYPOGRAPHY_FONT_SIZE,
                      fontWeight: STYLE_CONSTANTS.TYPOGRAPHY_FONT_WEIGHT,
                      color: STYLE_CONSTANTS.CURRENT_TEXT_COLOR,
                      lineHeight: 1.4,
                    }}
                  >
                    {breadcrumbLabel}
                  </Typography>
                ) : isNavigable ? (
                  <Chip
                    label={breadcrumbLabel}
                    size="small"
                    onClick={() => navigate(segmentPath)}
                    sx={{
                      bgcolor: "transparent",
                      color: STYLE_CONSTANTS.MUTED_TEXT_COLOR,
                      fontWeight: 600,
                      cursor: "pointer",
                      "&:hover": {
                        bgcolor: STYLE_CONSTANTS.BRAND_PRIMARY_SOFT_BG,
                        color: STYLE_CONSTANTS.BRAND_PRIMARY,
                      },
                    }}
                  />
                ) : (
                  <Chip
                    label={breadcrumbLabel}
                    size="small"
                    aria-disabled="true"
                    sx={{
                      bgcolor: "transparent",
                      color: STYLE_CONSTANTS.DISABLED_TEXT_COLOR,
                      fontWeight: 600,
                      cursor: "default",
                      pointerEvents: "none",
                    }}
                  />
                )}
              </Box>
            );
          })}
        </Breadcrumbs>
      </Box>
    </Fade>
  );
}
