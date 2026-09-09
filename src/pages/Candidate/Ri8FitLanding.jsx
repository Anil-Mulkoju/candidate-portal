import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  Container,
  Chip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import BoltIcon from "@mui/icons-material/Bolt";
import CheckIcon from "@mui/icons-material/Check";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import HubOutlinedIcon from "@mui/icons-material/HubOutlined";
import SpeedOutlinedIcon from "@mui/icons-material/SpeedOutlined";
import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import ri8fitLogo from "../../assets/ri8fit-logo.svg";
import Ri8fit_Logo from "../../assets/Ri8fit_Logo.png"
/* ---------- Design tokens ---------- */
const GREEN = "#2B6F71";
const GREEN_DARK = "#0F4547";
const GREEN_TINT = "#E7F1F0";
const AMBER = "#D98E4A";
const INK = "#122325";
const TEXT_GRAY = "#5C6D6E";
const BORDER = "#DEE7E6";
const SECTION_BG = "#F4F7F6";
const PAPER = "#FCFBF9";
const FONT_DISPLAY = "'Poppins', sans-serif";
const FONT_BODY = "'Inter', sans-serif";
const FONT_MONO = "'JetBrains Mono', 'Roboto Mono', monospace";

/* ---------- Scroll-in-view hook ---------- */
function useInView(threshold = 0.2) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect(); // animate once
        }
      },
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, inView];
}

/* ---------- Reveal wrapper: fade + slide-up, staggered ---------- */
function Reveal({ children, delay = 0, y = 18 }) {
  const [ref, inView] = useInView(0.15);
  return (
    <Box
      ref={ref}
      sx={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0px)" : `translateY(${y}px)`,
        transition: `opacity 0.6s cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 0.6s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
        height: "100%",
      }}
    >
      {children}
    </Box>
  );
}

/* ---------- Signature element: Match Ring (animates fill on load) ---------- */
function MatchRing({ value, size = 64, stroke = 6, color = GREEN, label }) {
  const [ref, inView] = useInView(0.4);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (inView) {
      // small delay so the draw-in reads as intentional, not instant
      const t = setTimeout(() => setProgress(value), 120);
      return () => clearTimeout(t);
    }
  }, [inView, value]);

  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (progress / 100) * c;

  return (
    <Box
      ref={ref}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 0.75,
      }}
    >
      <Box sx={{ position: "relative", width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke={BORDER}
            strokeWidth={stroke}
            fill="none"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke={color}
            strokeWidth={stroke}
            fill="none"
            strokeDasharray={c}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{
              transition: "stroke-dashoffset 1.3s cubic-bezier(0.22,1,0.36,1)",
            }}
          />
        </svg>
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            sx={{
              fontFamily: FONT_MONO,
              fontWeight: 700,
              fontSize: size * 0.22,
              color: INK,
            }}
          >
            {progress}%
          </Typography>
        </Box>
      </Box>
      {label && (
        <Typography
          sx={{
            fontSize: 12.5,
            color: TEXT_GRAY,
            textAlign: "center",
            fontFamily: FONT_BODY,
          }}
        >
          {label}
        </Typography>
      )}
    </Box>
  );
}

/* ---------- Reusable bits ---------- */
function SectionBadge({ children, dotColor = GREEN }) {
  return (
    <Chip
      icon={
        <FiberManualRecordIcon
          sx={{ fontSize: "8px !important", color: `${dotColor} !important` }}
        />
      }
      label={children}
      variant="outlined"
      sx={{
        borderRadius: "20px",
        borderColor: BORDER,
        color: TEXT_GRAY,
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: 0.6,
        px: 1,
        mb: 2,
        bgcolor: "#fff",
      }}
    />
  );
}

function IconBadge({ Icon, size = 40 }) {
  return (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: "12px",
        bgcolor: GREEN_TINT,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        mb: 1.5,
        transition: "transform 0.25s ease",
      }}
    >
      <Icon sx={{ color: GREEN, fontSize: size * 0.5 }} />
    </Box>
  );
}

function InfoCard({ title, desc, tags }) {
  return (
    <Card
      elevation={0}
      sx={{
        border: `1px solid ${BORDER}`,
        borderRadius: "16px",
        p: 3,
        height: "100%",
        bgcolor: "#fff",
        transition:
          "transform 0.25s cubic-bezier(0.22,1,0.36,1), box-shadow 0.25s ease, border-color 0.25s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0px 12px 28px rgba(18,35,37,0.10)",
          borderColor: GREEN,
        },
        "&:hover .icon-badge": { transform: "scale(1.08)" },
      }}
    >
      <Box className="icon-badge" sx={{ display: "inline-flex" }}>
        <IconBadge Icon={WorkspacePremiumIcon} />
        <Box sx={{ ml: 2 }}>
          <Typography
            sx={{
              fontFamily: FONT_DISPLAY,
              fontWeight: 700,
              fontSize: 16,
              color: INK,
              mb: 0.75,
            }}
          >
            {title}
          </Typography>
          <Typography
            sx={{
              fontSize: 13.5,
              color: TEXT_GRAY,
              lineHeight: 1.55,
              mb: tags ? 1.5 : 0,
            }}
          >
            {desc}
          </Typography>
        </Box>
      </Box>
      <Box sx={{ ml: 4.7 }}>

        {tags && (
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {tags.map((t) => (
              <Chip
                key={t}
                label={t}
                size="small"
                sx={{
                  bgcolor: SECTION_BG,
                  border: `1px solid ${BORDER}`,
                  fontSize: 11,
                  fontFamily: FONT_MONO,
                  color: TEXT_GRAY,
                  borderRadius: "8px",
                }}
              />
            ))}
          </Box>
        )}
      </Box>
    </Card>
  );
}

function StepCard({ number, title, desc }) {
  return (
    <Card
      elevation={0}
      sx={{
        position: "relative",
        border: `1px solid ${BORDER}`,
        borderRadius: "16px",
        p: 3,
        height: "100%",
        bgcolor: "#fff",
        transition:
          "transform 0.25s cubic-bezier(0.22,1,0.36,1), box-shadow 0.25s ease, border-color 0.25s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0px 12px 28px rgba(18,35,37,0.10)",
          borderColor: GREEN,
        },
      }}
    >
      <Typography
        sx={{
          fontFamily: FONT_MONO,
          fontWeight: 700,
          fontSize: 13,
          color: GREEN,
          bgcolor: GREEN_TINT,
          display: "inline-block",
          px: 1.2,
          py: 0.4,
          borderRadius: "8px",
          mb: 2,
        }}
      >
        Step {String(number).padStart(2, "0")}
      </Typography>
      <Typography
        sx={{
          fontFamily: FONT_DISPLAY,
          fontWeight: 700,
          fontSize: 16,
          color: INK,
          mb: 1,
        }}
      >
        {title}
      </Typography>
      <Typography sx={{ fontSize: 13.5, color: TEXT_GRAY, lineHeight: 1.55 }}>
        {desc}
      </Typography>
    </Card>
  );
}

function WhyCard({ title, Icon }) {
  return (
    <Box
      sx={{
        textAlign: "center",
        transition: "transform 0.25s ease",
        "&:hover": {
          transform: "translateY(-4px)",
        },
        "&:hover .why-icon": {
          bgcolor: GREEN,
          "& svg": {
            color: "#fff",
          },
        },
      }}
    >
      <Box
        className="why-icon"
        sx={{
          width: 56,
          height: 56,
          mx: "auto",
          mb: 1.5,
          borderRadius: "50%",
          bgcolor: GREEN_TINT,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "background-color 0.25s ease",
        }}
      >
        <Icon
          sx={{
            color: GREEN,
            fontSize: 28,
            transition: "color 0.25s ease",
          }}
        />
      </Box>

      <Typography
        sx={{
          fontFamily: FONT_DISPLAY,
          fontWeight: 700,
          fontSize: 14,
          color: INK,
        }}
      >
        {title}
      </Typography>
    </Box>
  );
}

/* ---------- Interactive candidate platform preview ---------- */
function PlatformPreview() {
  const [tab, setTab] = React.useState("dashboard");

  const navItems = [
    { key: "dashboard", label: "Dashboard" },
    { key: "matches", label: "Job Matches" },
    { key: "gaps", label: "Skill Gaps" },
    { key: "applications", label: "Applications" },
  ];

  const jobs = [
    {
      title: "Senior Clinical Data Manager",
      company: "Vantage CRO",
      match: 91,
    },
    { title: "Biostatistician II", company: "Northline Pharma", match: 84 },
    {
      title: "Regulatory Affairs Specialist",
      company: "Helix Biotech",
      match: 77,
    },
  ];

  const skills = [
    { name: "Clinical SAS", have: 90, need: 85 },
    { name: "CDISC Standards", have: 60, need: 80 },
    { name: "Regulatory Writing", have: 45, need: 70 },
  ];

  const applications = [
    { title: "Senior Clinical Data Manager", stage: "Interview", color: AMBER },
    { title: "Biostatistician II", stage: "Applied", color: TEXT_GRAY },
    { title: "Regulatory Affairs Specialist", stage: "Offer", color: GREEN },
  ];

  const interviews = [
    {
      title: "Biostatistician II",
      when: "Tomorrow, 10:00 AM",
      with: "Northline Pharma",
    },
    {
      title: "Clinical Programming",
      when: "Fri, 2:30 PM",
      with: "Helix Biotech",
    },
  ];

  return (
    <Card
      elevation={0}
      sx={{
        border: `1px solid ${BORDER}`,
        borderRadius: "20px",
        p: 2,
        bgcolor: "#FAFBFA",
        boxShadow: "0px 16px 48px rgba(18,35,37,0.10)",
      }}
    >
      <Typography
        sx={{
          fontFamily: FONT_MONO,
          fontSize: 24,
          fontWeight: 600,
          color: TEXT_GRAY,
          mb: 1,
          px: 1,
        }}
      >
        Ri8fit Platform
      </Typography>
      <Grid container spacing={1}>
        {/* Sidebar nav — now clickable, candidate-oriented labels */}
        <Grid size={{ xs: 12, sm: 3 }}>
          <Card
            elevation={0}
            sx={{
              border: `1px solid ${BORDER}`,
              borderRadius: "12px",
              p: 1.5,
              bgcolor: "#fff",
            }}
          >
            {navItems.map((item) => (
              <Box
                key={item.key}
                onClick={() => setTab(item.key)}
                sx={{
                  cursor: "pointer",
                  fontSize: 10,
                  py: 0.8,
                  px: 0.5,
                  mb: 0.25,
                  borderRadius: "6px",
                  color: tab === item.key ? GREEN : TEXT_GRAY,
                  bgcolor: tab === item.key ? GREEN_TINT : "transparent",
                  fontWeight: tab === item.key ? 700 : 400,
                  transition: "background-color 0.2s ease, color 0.2s ease",
                  "&:hover": {
                    bgcolor: tab === item.key ? GREEN_TINT : SECTION_BG,
                  },
                }}
              >
                {item.label}
              </Box>
            ))}
          </Card>
        </Grid>

        {/* Content pane */}
        <Grid size={{ xs: 12, sm: 9 }}>
          <Card
            elevation={0}
            sx={{
              border: `1px solid ${BORDER}`,
              borderRadius: "12px",
              p: 2,
              bgcolor: "#fff",
              minHeight: 280,
            }}
          >
            {tab === "dashboard" && (
              <Box>
                <Typography
                  sx={{
                    fontFamily: FONT_DISPLAY,
                    fontWeight: 700,
                    fontSize: 13,
                    color: INK,
                  }}
                >
                  Candidate dashboard
                </Typography>
                <Typography sx={{ fontSize: 10, color: TEXT_GRAY, mb: 1.5 }}>
                  Track applications and AI-powered matches in one place.
                </Typography>
                <Box
                  sx={{
                    border: `1px solid ${BORDER}`,
                    borderRadius: "10px",
                    p: 1.5,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1.5,
                  }}
                >
                  <Typography
                    sx={{ fontSize: 11, fontWeight: 600, color: INK }}
                  >
                    Senior Clinical Data Manager{" "}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    bgcolor: GREEN_TINT,
                    borderRadius: "10px",
                    py: 2,
                    display: "flex",
                    justifyContent: "center",
                    mb: 1.5,
                  }}
                >
                  <MatchRing value={91} size={78} color={GREEN} />
                </Box>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button
                    size="small"
                    onClick={() => setTab("matches")}
                    sx={{
                      flex: 1,
                      fontSize: 10.5,
                      textTransform: "none",
                      bgcolor: GREEN,
                      color: "#fff",
                      borderRadius: "8px",
                      "&:hover": { bgcolor: GREEN_DARK },
                    }}
                  >
                    Find jobs
                  </Button>
                  <Button
                    size="small"
                    onClick={() => setTab("gaps")}
                    sx={{
                      flex: 1,
                      fontSize: 10.5,
                      textTransform: "none",
                      border: `1px solid ${BORDER}`,
                      color: INK,
                      borderRadius: "8px",
                      "&:hover": { bgcolor: SECTION_BG },
                    }}
                  >
                    View gap analysis
                  </Button>
                </Box>
              </Box>
            )}
            {tab === "matches" && (
              <Box>
                <Typography
                  sx={{
                    fontFamily: FONT_DISPLAY,
                    fontWeight: 700,
                    fontSize: 13,
                    color: INK,
                    mb: 1.5,
                  }}
                >
                  Recommended for you
                </Typography>
                {jobs.map((j) => (
                  <Box
                    key={j.title}
                    sx={{
                      border: `1px solid ${BORDER}`,
                      borderRadius: "10px",
                      p: 1.2,
                      mb: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      cursor: "pointer",
                      transition: "border-color 0.2s ease, transform 0.2s ease",
                      "&:hover": {
                        borderColor: GREEN,
                        transform: "translateX(2px)",
                      },
                    }}
                  >
                    <Box>
                      <Typography
                        sx={{ fontSize: 11, fontWeight: 600, color: INK }}
                      >
                        {j.title}
                      </Typography>
                      <Typography sx={{ fontSize: 9.5, color: TEXT_GRAY }}>
                        {j.company}
                      </Typography>
                    </Box>
                    <Chip
                      label={`${j.match}% match`}
                      size="small"
                      sx={{
                        fontFamily: FONT_MONO,
                        fontSize: 9.5,
                        bgcolor: GREEN_TINT,
                        color: GREEN,
                        fontWeight: 700,
                      }}
                    />
                  </Box>
                ))}
              </Box>
            )}
            {tab === "gaps" && (
              <Box>
                <Typography
                  sx={{
                    fontFamily: FONT_DISPLAY,
                    fontWeight: 700,
                    fontSize: 13,
                    color: INK,
                    mb: 0.5,
                  }}
                >
                  Skill gap analysis
                </Typography>
                <Typography sx={{ fontSize: 9.5, color: TEXT_GRAY, mb: 1.5 }}>
                  Compared against your top matched role
                </Typography>
                {skills.map((s) => (
                  <Box key={s.name} sx={{ mb: 1.5 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 0.5,
                      }}
                    >
                      <Typography
                        sx={{ fontSize: 10.5, color: INK, fontWeight: 600 }}
                      >
                        {s.name}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: 9.5,
                          color: s.have >= s.need ? GREEN : AMBER,
                          fontFamily: FONT_MONO,
                        }}
                      >
                        {s.have}% / {s.need}% needed
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        position: "relative",
                        height: 6,
                        borderRadius: "4px",
                        bgcolor: BORDER,
                      }}
                    >
                      <Box
                        sx={{
                          position: "absolute",
                          left: 0,
                          top: 0,
                          height: "100%",
                          width: `${s.have}%`,
                          borderRadius: "4px",
                          bgcolor: s.have >= s.need ? GREEN : AMBER,
                          transition: "width 1s cubic-bezier(0.22,1,0.36,1)",
                        }}
                      />
                      <Box
                        sx={{
                          position: "absolute",
                          left: `${s.need}%`,
                          top: -2,
                          width: 2,
                          height: 10,
                          bgcolor: INK,
                        }}
                      />
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
            {tab === "applications" && (
              <Box>
                <Typography
                  sx={{
                    fontFamily: FONT_DISPLAY,
                    fontWeight: 700,
                    fontSize: 13,
                    color: INK,
                    mb: 1.5,
                  }}
                >
                  Your applications
                </Typography>
                {applications.map((a) => (
                  <Box
                    key={a.title}
                    sx={{
                      border: `1px solid ${BORDER}`,
                      borderRadius: "10px",
                      p: 1.2,
                      mb: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography sx={{ fontSize: 11, color: INK }}>
                      {a.title}
                    </Typography>
                    <Chip
                      label={a.stage}
                      size="small"
                      sx={{
                        fontSize: 9.5,
                        bgcolor: `${a.color}1A`,
                        color: a.color,
                        fontWeight: 700,
                      }}
                    />
                  </Box>
                ))}
              </Box>
            )}
            {tab === "interviews" && (
              <Box>
                <Typography
                  sx={{
                    fontFamily: FONT_DISPLAY,
                    fontWeight: 700,
                    fontSize: 13,
                    color: INK,
                    mb: 1.5,
                  }}
                >
                  Upcoming interviews
                </Typography>
                {interviews.map((i) => (
                  <Box
                    key={i.title}
                    sx={{
                      border: `1px solid ${BORDER}`,
                      borderRadius: "10px",
                      p: 1.2,
                      mb: 1,
                      display: "flex",
                      alignItems: "center",
                      gap: 1.2,
                    }}
                  >
                    <CalendarMonthIcon sx={{ fontSize: 16, color: GREEN }} />
                    <Box>
                      <Typography
                        sx={{ fontSize: 11, fontWeight: 600, color: INK }}
                      >
                        {i.title}
                      </Typography>
                      <Typography sx={{ fontSize: 9.5, color: TEXT_GRAY }}>
                        {i.when} · {i.with}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
          </Card>
        </Grid>
      </Grid>
      <Card
        elevation={0}
        sx={{
          mt: 1,
          border: `1px solid ${BORDER}`,
          borderRadius: "10px",
          p: 1,
          display: "flex",
          alignItems: "center",
          gap: 1,
          bgcolor: "#fff",
          width: "fit-content",
        }}
      >
        <FiberManualRecordIcon sx={{ fontSize: 10, color: GREEN }} />
        <Typography
          sx={{ fontSize: 10, color: TEXT_GRAY, fontFamily: FONT_MONO }}
        >
          status: live matching
        </Typography>
      </Card>
    </Card>
  );
}
/* ---------- Main Component ---------- */
function Ri8FitLanding() {
  const navigate = useNavigate();

  const stats = [
    { value: 94, label: "Accurate skill matching" },
    { value: 88, label: "Faster hiring cycles" },
    { value: 76, label: "Candidate response rate" },
    { value: 100, label: "Profile-to-portal coverage" },
  ];

  const trustedRow1 = [
    "Global Capability Centers",
    "Clinical CROs",
    "Global Pharma",
    "Biotech Companies",
  ];
  const trustedRow2 = [
    "MedTech & Devices",
    "Clinical Trial Sponsors",
    "Research Institutions",
  ];

  const steps = [
    {
      title: "Create your profile",
      desc: "Add your experience, skills, certifications, and resume.",
    },
    {
      title: "Get AI matched",
      desc: "Receive personalized job recommendations based on your skills.",
    },
    {
      title: "Apply easily",
      desc: "Apply with one click and monitor every application.",
    },
    {
      title: "Attend interviews",
      desc: "Schedule interviews and join directly from the platform.",
    },
    {
      title: "Receive offers",
      desc: "Track offers and complete onboarding from one dashboard.",
    },
  ];

  const whyCards = [
    {
      title: "Clinical skill intelligence",
      icon: PsychologyOutlinedIcon,
    },
    {
      title: "Domain-specific matching",
      icon: HubOutlinedIcon,
    },
    {
      title: "Transparent match scores",
      icon: SpeedOutlinedIcon,
    },
    {
      title: "Faster hiring process",
      icon: BoltOutlinedIcon,
    },
  ];

  const platformFeatures = [
    {
      title: "AI Job Recommendations",
      desc: "Personalized opportunities based on your profile.",
    },
    {
      title: "Smart Profile",
      desc: "Build a complete professional profile once.",
    },
    { title: "Resume Management", desc: "Upload and update resumes anytime." },
    {
      title: "Application Tracker",
      desc: "Track every application in real time.",
    },
    {
      title: "Interview Hub",
      desc: "Manage interview schedules and feedback.",
    },
    {
      title: "Offers & Joining",
      desc: "Accept offers and complete onboarding digitally.",
    },
  ];

  const opportunities = [
    {
      title: "Clinical GCC Excellence",
      desc: "Ensure accurate, secure, and compliant clinical trial data.",
    },
    {
      title: "Statistical Programming",
      desc: "Develop statistical datasets and analyses for clinical studies.",
    },
    {
      title: "Clinical Programming",
      desc: "Build and maintain systems supporting clinical trial operations.",
    },
    {
      title: "Biostatistics",
      desc: "Analyze clinical data to generate reliable scientific insights.",
    },
    {
      title: "Pharmacovigilance",
      desc: "Monitor drug safety and report adverse event information.",
    },
    {
      title: "Regulatory Affairs",
      desc: "Ensure products comply with global regulatory requirements.",
    },
    {
      title: "Clinical Research",
      desc: "Support and manage clinical trials from start to finish.",
    },
    {
      title: "Medical Writing",
      desc: "Create clear, compliant clinical and regulatory documentation.",
    },
    {
      title: "Clinical SAS",
      desc: "Program and validate clinical trial datasets and reports.",
    },
  ].map((o) => ({ ...o, tags: ["Clinical", "SAS", "Biostats", "PV"] }));

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: PAPER,
        display: "flex",
        flexDirection: "column",
        fontFamily: FONT_BODY,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          bgcolor: "rgba(252, 251, 249, 0.85)",
          backdropFilter: "blur(8px)",
          borderBottom: `1px solid ${BORDER}`,
        }}
      >
        <Grid
          container
          justifyContent="space-between"
          alignItems="center"
          sx={{
            py: { xs: 1, sm: 1 },
            px: { xs: 2, sm: 4, md: 6, lg: 10 },
            borderBottom: `1px solid ${BORDER}`,
          }}
        >
          <Grid size={{ xs: 6 }}>
            <Box
              component="img"
              // src={ri8fitLogo}
              src={Ri8fit_Logo}
              alt="Ri8fit"
              sx={{
                height: { xs: 30, sm: 34, md: 38 },
                width: "auto",
                display: "block",
              }}
            />
          </Grid>
          <Grid
            size={{ xs: 6 }}
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            <Button
              variant="outlined"
              sx={{
                borderRadius: "50px",
                textTransform: "none",
                borderColor: BORDER,
                color: GREEN_DARK,
                px: { xs: 1.5, sm: 2.5 },
                py: { xs: 0.6, sm: 0.5 },
                fontSize: { xs: 12, sm: 14 },
                transition: "background-color 0.2s ease",
                "&:hover": { bgcolor: GREEN_TINT },
              }}
              onClick={() => navigate("/for-candidate/signup")}
            >
              Sign up
            </Button>
            <Button
              variant="contained"
              sx={{
                bgcolor: GREEN,
                borderRadius: "50px",
                textTransform: "none",
                px: { xs: 1.5, sm: 2.5 },
                py: { xs: 0.6, sm: 0.5 },
                fontSize: { xs: 12, sm: 14 },
                boxShadow: "none",
                transition: "background-color 0.2s ease",
                "&:hover": { bgcolor: GREEN_DARK },
              }}
              onClick={() => navigate("/for-candidate/login")}
            >
              Log in
            </Button>
          </Grid>
        </Grid>
      </Box>
      {/* Hero */}
      <Container
        maxWidth="xl"
        sx={{ mt: { xs: 5, md: 1 }, position: "relative" }}
      >
        <Box
          component="svg"
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 220,
            height: 220,
            opacity: 0.35,
            display: { xs: "none", md: "block" },
            zIndex: 0,
          }}
        >
          <defs>
            <pattern
              id="dots"
              width="14"
              height="14"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="1.5" cy="1.5" r="1.5" fill={GREEN} />
            </pattern>
          </defs>
          <rect width="220" height="220" fill="url(#dots)" />
        </Box>

        <Grid
          container
          spacing={{ xs: 5, md: 8 }}
          alignItems="center"
          sx={{ position: "relative", zIndex: 1 }}
        >
          <Grid size={{ xs: 12, md: 6 }}>
            <SectionBadge>
              Get matched. Get interviewed. Get hired.
            </SectionBadge>
            <Typography
              sx={{
                fontFamily: FONT_DISPLAY,
                fontWeight: 700,
                fontSize: { xs: 34, sm: 42, md: 48, lg: 54 },
                lineHeight: 1.15,
                color: INK,
              }}
            >
              Find your next{" "}
              <Box component="span" sx={{ color: GREEN }}>
                clinical career
              </Box>{" "}
              faster
            </Typography>

            <Typography
              sx={{
                mt: 2.5,
                fontSize: { xs: 15, md: 16 },
                color: TEXT_GRAY,
                lineHeight: 1.7,
                maxWidth: 520,
              }}
            >
              Ri8Fit matches your skills with the right clinical opportunities —
              discover relevant jobs, track applications, prepare for
              interviews, and manage offers all from one platform.
            </Typography>

            <Chip
              icon={
                <BoltIcon sx={{ fontSize: 16, color: `${AMBER} !important` }} />
              }
              label="Faster hiring cycles with reduced overhead"
              sx={{
                mt: 3,
                bgcolor: SECTION_BG,
                color: INK,
                fontSize: 13,
                fontWeight: 500,
              }}
            />

            <Box sx={{ display: "flex", gap: 2, mt: 3, flexWrap: "wrap" }}>
              <Button
                variant="contained"
                endIcon={<ArrowForwardIcon />}
                sx={{
                  bgcolor: GREEN,
                  borderRadius: "10px",
                  textTransform: "none",
                  px: 3,
                  py: 1.2,
                  boxShadow: "none",
                  transition: "background-color 0.2s ease, transform 0.2s ease",
                  "&:hover": {
                    bgcolor: GREEN_DARK,
                    transform: "translateY(-2px)",
                  },
                }}
                onClick={() => navigate("/jobs")}
              >
                Explore jobs
              </Button>
              <Button
                variant="outlined"
                endIcon={<KeyboardArrowDownIcon />}
                sx={{
                  borderRadius: "10px",
                  textTransform: "none",
                  px: 3,
                  py: 1.2,
                  borderColor: BORDER,
                  color: INK,
                  transition: "transform 0.2s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    bgcolor: SECTION_BG,
                  },
                }}
                onClick={() => navigate("/for-candidate/signup")}
              >
                Create profile
              </Button>
            </Box>

            <Box sx={{ display: "flex", gap: 3, mt: 3, flexWrap: "wrap" }}>
              {[
                "AI job matching",
                "Clinical career ready",
                "Application tracking",
              ].map((t) => (
                <Box
                  key={t}
                  sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                >
                  <CheckIcon sx={{ fontSize: 16, color: GREEN }} />
                  <Typography sx={{ fontSize: 13, color: TEXT_GRAY }}>
                    {t}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Grid>

          {/* Dashboard mockup */}
          <Grid size={{ xs: 12, md: 6 }}>
            <PlatformPreview />
          </Grid>
        </Grid>

        {/* Stats bar */}
        <Grid
          container
          spacing={2}
          sx={{ mt: { xs: 7, md: 10 }, mb: { xs: 7, md: 10 } }}
          justifyContent="center"
        >
          {stats.map((s, i) => (
            <Grid
              size={{ xs: 6, sm: 3 }}
              key={i}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <Reveal delay={i * 100}>
                <MatchRing
                  value={s.value}
                  size={84}
                  label={s.label}
                  color={i % 2 === 0 ? GREEN : AMBER}
                />
              </Reveal>
            </Grid>
          ))}
        </Grid>

        {/* Trusted By */}
        <Reveal>
          <Box
            sx={{
              bgcolor: SECTION_BG,
              borderRadius: "24px",
              p: { xs: 4, md: 6 },
              textAlign: "center",
              mb: { xs: 8, md: 12 },
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <SectionBadge dotColor={AMBER}>Trusted by</SectionBadge>
            </Box>
            <Typography
              sx={{
                fontFamily: FONT_DISPLAY,
                fontWeight: 700,
                fontSize: { xs: 22, md: 28 },
                color: INK,
                mb: 3,
              }}
            >
              Big companies hire through Ri8Fit
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: 1.5,
                mb: 1.5,
              }}
            >
              {trustedRow1.map((t) => (
                <Chip
                  key={t}
                  label={t}
                  sx={{
                    bgcolor: "#fff",
                    border: `1px solid ${BORDER}`,
                    color: INK,
                    fontSize: 13,
                  }}
                />
              ))}
            </Box>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: 1.5,
                mb: 2,
              }}
            >
              {trustedRow2.map((t) => (
                <Chip
                  key={t}
                  label={t}
                  sx={{
                    bgcolor: "#fff",
                    border: `1px solid ${BORDER}`,
                    color: INK,
                    fontSize: 13,
                  }}
                />
              ))}
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 0.75,
              }}
            >
              <FiberManualRecordIcon sx={{ fontSize: 8, color: GREEN }} />
              <Typography sx={{ fontSize: 13, color: TEXT_GRAY }}>
                And many more leading life sciences organizations
              </Typography>
            </Box>
          </Box>
        </Reveal>

        {/* How it works */}
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <SectionBadge>Your process</SectionBadge>
          <Typography
            sx={{
              fontFamily: FONT_DISPLAY,
              fontWeight: 700,
              fontSize: { xs: 26, md: 34 },
              color: INK,
            }}
          >
            How it works
          </Typography>
          <Typography sx={{ fontSize: 14, color: TEXT_GRAY, mt: 1 }}>
            From profile to offer — your career journey in five steps
          </Typography>
        </Box>
        <Grid
          container
          spacing={3}
          justifyContent="center"
          sx={{ mb: { xs: 8, md: 12 } }}
        >
          {steps.map((s, i) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
              <Reveal delay={i * 90}>
                <StepCard number={i + 1} title={s.title} desc={s.desc} />
              </Reveal>
            </Grid>
          ))}
        </Grid>

        {/* Built For Clinical Professionals */}
        <Box sx={{ textAlign: "center", mb: 5 }}>
          <SectionBadge dotColor={AMBER}>Why Ri8Fit</SectionBadge>
          <Typography
            sx={{
              fontFamily: FONT_DISPLAY,
              fontWeight: 700,
              fontSize: { xs: 26, md: 34 },
              color: INK,
            }}
          >
            Built for{" "}
            <Box component="span" sx={{ color: GREEN }}>
              clinical professionals
            </Box>
          </Typography>
          <Typography
            sx={{
              fontSize: 14,
              color: TEXT_GRAY,
              mt: 1,
              maxWidth: 620,
              mx: "auto",
            }}
          >
            Unlike generic job portals, Ri8Fit understands clinical roles and
            matches candidates using real clinical expertise.
          </Typography>
        </Box>
        <Grid
          container
          spacing={4}
          justifyContent="center"
          sx={{ mb: { xs: 8, md: 12 } }}
        >
          {whyCards.map((item, i) => (
            <Grid size={{ xs: 6, sm: 3 }} key={item.title}>
              <Reveal delay={i * 90}>
                <WhyCard title={item.title} Icon={item.icon} />
              </Reveal>
            </Grid>
          ))}
        </Grid>

        {/* Platform Features */}
        <Box sx={{ textAlign: "center", mb: 5 }}>
          <SectionBadge>Platform capabilities</SectionBadge>
          <Typography
            sx={{
              fontFamily: FONT_DISPLAY,
              fontWeight: 700,
              fontSize: { xs: 26, md: 34 },
              color: INK,
            }}
          >
            Platform{" "}
            <Box component="span" sx={{ color: GREEN }}>
              features
            </Box>
          </Typography>
          <Typography sx={{ fontSize: 14, color: TEXT_GRAY, mt: 1 }}>
            Everything you need in your career portal
          </Typography>
        </Box>
        <Grid container spacing={3} sx={{ mb: { xs: 8, md: 12 } }}>
          {platformFeatures.map((f, i) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={f.title}>
              <Reveal delay={(i % 3) * 90}>
                <InfoCard title={f.title} desc={f.desc} />
              </Reveal>
            </Grid>
          ))}
        </Grid>

        {/* Career Opportunities */}
        <Box sx={{ textAlign: "center", mb: 5 }}>
          <SectionBadge>Opportunities</SectionBadge>
          <Typography
            sx={{
              fontFamily: FONT_DISPLAY,
              fontWeight: 700,
              fontSize: { xs: 26, md: 34 },
              color: INK,
            }}
          >
            Career{" "}
            <Box component="span" sx={{ color: GREEN }}>
              opportunities
            </Box>
          </Typography>
          <Typography sx={{ fontSize: 14, color: TEXT_GRAY, mt: 1 }}>
            Opportunities across clinical domains
          </Typography>
        </Box>
        <Grid container spacing={3} sx={{ mb: { xs: 8, md: 10 } }}>
          {opportunities.map((o, i) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={o.title}>
              <Reveal delay={(i % 3) * 90}>
                <InfoCard title={o.title} desc={o.desc} tags={o.tags} />
              </Reveal>
            </Grid>
          ))}
        </Grid>

        {/* CTA */}
        <Reveal>
          <Box
            sx={{
              background: `linear-gradient(120deg, ${GREEN_TINT} 0%, #F7FBFA 60%, #FFFFFF 100%)`,
              border: `1px solid ${BORDER}`,
              borderRadius: "24px",
              textAlign: "center",
              py: { xs: 6, md: 8 },
              px: 2,
              mb: { xs: 6, md: 8 },
            }}
          >
            <SectionBadge dotColor={AMBER}>Get started</SectionBadge>
            <Typography
              sx={{
                fontFamily: FONT_DISPLAY,
                fontWeight: 700,
                fontSize: { xs: 26, md: 36 },
                color: INK,
                lineHeight: 1.2,
              }}
            >
              Ready for your next
            </Typography>
            <Typography
              sx={{
                fontFamily: FONT_DISPLAY,
                fontWeight: 700,
                fontSize: { xs: 26, md: 36 },
                color: GREEN,
                lineHeight: 1.2,
                mb: 2,
              }}
            >
              clinical opportunity
            </Typography>
            <Typography sx={{ fontSize: 14, color: TEXT_GRAY, mb: 3 }}>
              Build your profile once
            </Typography>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <Button
                variant="contained"
                endIcon={<ArrowForwardIcon />}
                sx={{
                  bgcolor: GREEN,
                  borderRadius: "10px",
                  textTransform: "none",
                  px: 3,
                  py: 1.2,
                  boxShadow: "none",
                  transition: "background-color 0.2s ease, transform 0.2s ease",
                  "&:hover": {
                    bgcolor: GREEN_DARK,
                    transform: "translateY(-2px)",
                  },
                }}
                onClick={() => navigate("/jobs")}
              >
                Explore jobs
              </Button>
              <Button
                variant="outlined"
                sx={{
                  borderRadius: "10px",
                  textTransform: "none",
                  px: 3,
                  py: 1.2,
                  borderColor: BORDER,
                  color: INK,
                  bgcolor: "#fff",
                  transition: "transform 0.2s ease",
                  "&:hover": { transform: "translateY(-2px)" },
                }}
                onClick={() => navigate("/for-candidate/signup")}
              >
                Create free profile
              </Button>
            </Box>
          </Box>
        </Reveal>
      </Container>

      {/* Footer */}
      <Box sx={{ borderTop: `1px solid ${BORDER}`, py: 3, bgcolor: "#fff" }}>
        <Container maxWidth="xl">
          <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
          >
            <Grid size={{ xs: 12, sm: "auto" }}>
              <Box
                component="img"
                // src={ri8fitLogo}
                src={Ri8fit_Logo}
                alt="Ri8fit"
                sx={{ height: 26, width: "auto", display: "block" }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: "auto" }}>
              <Typography
                sx={{
                  fontSize: 12.5,
                  color: TEXT_GRAY,
                  fontFamily: FONT_MONO,
                  textAlign: { xs: "left", sm: "right" },
                }}
              >
                © 2026 Ri8Fit — Get matched · Get interviewed · Get hired
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}

export default Ri8FitLanding;
