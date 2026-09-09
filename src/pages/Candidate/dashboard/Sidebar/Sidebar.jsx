import React, { useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItemText,
  IconButton,
  Tooltip,
  Collapse,
  ButtonBase,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import CelebrationIcon from "@mui/icons-material/Celebration";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import { styled } from "@mui/system";
import { palette, fonts } from "../../../../theme/candidateTokens";

const StyledSidebar = styled(Box)(({ theme }) => ({
  backgroundColor: palette.paper,
  borderRadius: 14,
  border: `1px solid ${palette.line}`,
  padding: theme.spacing(3),
  position: "sticky",
  top: 80,
  maxWidth: 320,
  [theme.breakpoints.down("sm")]: {
    position: "static",
    marginBottom: theme.spacing(2),
    padding: theme.spacing(2),
    maxWidth: "100%",
  },
}));

const RING_SIZE = 108;
const STROKE = 9;
const RADIUS = (RING_SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function CompletionRing({ percent }) {
  const clamped = Math.max(0, Math.min(100, percent));
  const offset = CIRCUMFERENCE - (clamped / 100) * CIRCUMFERENCE;

  return (
    <Box sx={{ position: "relative", width: RING_SIZE, height: RING_SIZE, mx: "auto" }}>
      <svg width={RING_SIZE} height={RING_SIZE} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={RING_SIZE / 2} cy={RING_SIZE / 2} r={RADIUS} fill="none" stroke={palette.line} strokeWidth={STROKE} />
        <circle
          cx={RING_SIZE / 2}
          cy={RING_SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke={clamped === 100 ? palette.teal : palette.amber}
          strokeWidth={STROKE}
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 600ms ease" }}
        />
      </svg>
      <Box sx={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <Typography sx={{ fontFamily: fonts.mono, fontWeight: 600, fontSize: 22, color: palette.ink, lineHeight: 1 }}>
          {Math.round(clamped)}%
        </Typography>
        <Typography sx={{ fontSize: 10, color: palette.muted, letterSpacing: 0.4, mt: 0.5 }}>COMPLETE</Typography>
      </Box>
    </Box>
  );
}

const SECTION_ICONS = {
  resume: DescriptionOutlinedIcon,
  skills: BoltOutlinedIcon,
  employment: WorkOutlineOutlinedIcon,
  education: SchoolOutlinedIcon,
  certifications: WorkspacePremiumOutlinedIcon,
  personal: BadgeOutlinedIcon,
};

// Section ids that should never appear in the stepper, regardless of what the parent passes in
const EXCLUDED_SECTION_IDS = ["profileimage", "profile_image", "profile-image"];

function Sidebar({ sections, scrollToSection, activeSection, apiPercentage }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const toggleCollapse = () => setIsCollapsed((c) => !c);

  const displayPercent = apiPercentage ?? 0;

  const sectionTooltips = {
    resume: "Upload your resume to make your profile complete.",
    personal: "Add your name and contact details to make your profile discoverable.",
    employment: "List your work history to showcase your expertise.",
    education: "Include your academic background to highlight your qualifications.",
    skills: "Add relevant skills to stand out to recruiters.",
    certifications: "Add certifications to boost credibility.",
  };

  const displayLabel = (id, label) => {
    const norm = (s = "") => s.toLowerCase().replace(/\s+/g, "");
    if (norm(id).includes("employ") || norm(label).includes("employ")) return "Employment History";
    if (norm(id).includes("experien") || norm(label).includes("experien")) return "Employment History";
    return label;
  };

  const visibleSections = (sections || []).filter(
    (section) => !EXCLUDED_SECTION_IDS.includes((section.id || "").toLowerCase().replace(/\s+/g, ""))
  );

  return (
    <StyledSidebar>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
        <Typography sx={{ fontFamily: fonts.display, fontWeight: 600, fontSize: { xs: 17, sm: 18 }, color: palette.ink }}>
          Profile Completion
        </Typography>
        <IconButton
          onClick={toggleCollapse}
          sx={{ display: { xs: "block", sm: "none" }, color: palette.teal }}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ExpandMoreIcon /> : <ExpandLessIcon />}
        </IconButton>
      </Box>

      <Collapse in={!isCollapsed}>
        <Typography sx={{ fontSize: { xs: 12, sm: 13 }, color: palette.muted, mb: 2.5 }}>
          {displayPercent < 100
            ? "Complete your profile to get noticed by recruiters!"
            : "Great job! Your profile is complete."}
        </Typography>

        {/* <CompletionRing percent={displayPercent} /> */}

        {displayPercent === 100 && (
          <Box
            sx={{
              mt: 2,
              mx: "auto",
              width: "fit-content",
              display: "flex",
              alignItems: "center",
              gap: 0.75,
              bgcolor: palette.tealSoft,
              color: palette.teal,
              borderRadius: "999px",
              px: 1.5,
              py: 0.5,
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            <CelebrationIcon sx={{ fontSize: 16 }} />
            Profile Complete!
          </Box>
        )}

        <Box sx={{ mt: 3.5, position: "relative" }}>
          {visibleSections.map((section, index) => {
            const label = displayLabel(section.id, section.label);
            const Icon = SECTION_ICONS[section.id] || BadgeOutlinedIcon;
            const isActive = activeSection === section.id;
            const isLast = index === visibleSections.length - 1;

            return (
              <Tooltip
                key={section.id || index}
                title={sectionTooltips[section.id] || `Complete the ${label} section`}
                placement="right"
              >
                <Box sx={{ position: "relative", display: "flex", gap: 1.5 }}>
                  {/* rail: dot + connecting line */}
                  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", width: 28 }}>
                    <Box
                      sx={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        bgcolor: section.completed ? palette.teal : isActive ? palette.amberSoft : palette.canvas,
                        border: section.completed ? "none" : `2px solid ${isActive ? palette.amber : palette.line}`,
                        zIndex: 1,
                      }}
                    >
                      {section.completed ? (
                        <CheckIcon sx={{ fontSize: 16, color: "#fff" }} />
                      ) : (
                        <Icon sx={{ fontSize: 14, color: isActive ? palette.amber : palette.muted }} />
                      )}
                    </Box>
                    {!isLast && (
                      <Box
                        sx={{
                          width: 2,
                          flexGrow: 1,
                          minHeight: 22,
                          bgcolor: section.completed ? palette.teal : palette.line,
                          my: 0.25,
                        }}
                      />
                    )}
                  </Box>

                  {/* label */}
                  <ButtonBase
                    onClick={() => scrollToSection(section.id)}
                    aria-label={`Navigate to ${label} section`}
                    sx={{
                      flexGrow: 1,
                      justifyContent: "flex-start",
                      textAlign: "left",
                      borderRadius: "8px",
                      px: 1,
                      py: 0.5,
                      mb: isLast ? 0 : 1,
                      height: 34,
                      bgcolor: isActive ? palette.tealSoft : "transparent",
                      "&:hover": { bgcolor: palette.canvas },
                    }}
                  >
                    <ListItemText
                      primary={label}
                      primaryTypographyProps={{
                        fontSize: { xs: 12.5, sm: 14 },
                        fontWeight: isActive ? 600 : 500,
                        color: isActive ? palette.teal : palette.ink,
                      }}
                    />
                  </ButtonBase>
                </Box>
              </Tooltip>
            );
          })}
        </Box>
      </Collapse>
    </StyledSidebar>
  );
}

export default React.memo(Sidebar);