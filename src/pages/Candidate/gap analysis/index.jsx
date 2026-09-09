import React, { useMemo, useState } from "react";
import { Box, Typography, Chip, CircularProgress, Button, Skeleton } from "@mui/material";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import RemoveCircleOutlineRoundedIcon from "@mui/icons-material/RemoveCircleOutlineRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import { useGetCandidateSkillsQuery } from "../../../services/candiadteGapApi.js"; // adjust path to wherever you place the api slice

/* ── Design tokens — matches the teal/serif system used across the RI8FIT profile pages ── */
const INK = "#1F2937";
const TEXT_MUTED = "#6B7280";
const PRIMARY = "#2B6F71";
const PRIMARY_DARK = "#1E4F50";
const PRIMARY_TINT = "#EAF5F4";
const SURFACE = "#F8FAF9";
const BORDER = "#E1E5E7";
const WARN = "#B7791F";
const WARN_TINT = "#FBF3E4";
const MUTED_TINT = "#F3F4F6";
const MUTED_RING = "#C7CBD1";

// Serif stack for headings — matches "RI8FIT" / candidate name styling in the reference screenshot.
// Swap for your app's `fonts.display` token (from candidateTokens) if you already have one.
const FONT_DISPLAY = "'Georgia', 'Times New Roman', serif";

/* ── Skill key -> readable label (e.g. "sdtm_specifications" -> "SDTM Specifications") ── */
const LABEL_OVERRIDES = {
  sas_experience: "SAS Experience",
  r_experience: "R Experience",
  ta_experience: "TA Experience",
  phase1_experience: "Phase 1 Experience",
  phase2_4_experience: "Phase II–IV Experience",
  sdtm_experience: "SDTM Experience",
  sdtm_specifications: "SDTM Specifications",
  mapping_conversion: "Mapping / Conversion",
  acrf: "aCRF",
  complex_sdtm_domains: "Complex SDTM Domains",
  adam_experience: "ADaM Experience",
  adam_specifications: "ADaM Specifications",
  adeff: "ADEFF",
  tp_experience: "TP Experience",
  sdrg_adrg: "SDRG / ADRG",
  project_level: "Project Level",
  pooling_scs: "Pooling SCS",
  pooling_sce: "Pooling SCE",
  define_xml: "Define.xml",
  dsur_psur_dsmb_dmc_rmp: "DSUR / PSUR / DSMB / DMC / RMP",
  safety: "Safety",
  efficacy: "Efficacy",
  figures: "Figures",
};

const humanizeKey = (key) =>
  LABEL_OVERRIDES[key] ||
  key
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

const subFunctionLabel = (value) =>
  value
    ? value
      .split("_")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ")
    : "";

/* ── Score tiering — drives ring color/badge/icon ─────────────────────────── */
const getTier = (score) => {
  if (score >= 0.3) {
    return {
      label: "Confirmed",
      color: PRIMARY_DARK,
      ring: PRIMARY,
      bg: PRIMARY_TINT,
      border: PRIMARY,
      icon: CheckCircleRoundedIcon,
    };
  }
  if (score > 0) {
    return {
      label: "Possible",
      color: WARN,
      ring: WARN,
      bg: WARN_TINT,
      border: "#E4C588",
      icon: HelpOutlineRoundedIcon,
    };
  }
  return {
    label: "Not evidenced",
    color: TEXT_MUTED,
    ring: MUTED_RING,
    bg: MUTED_TINT,
    border: BORDER,
    icon: RemoveCircleOutlineRoundedIcon,
  };
};

/* ── Expandable AI note — mirrors the "See More..." pattern used on the profile page ── */
const NoteToggle = ({ text, limit = 110 }) => {
  const [expanded, setExpanded] = useState(false);
  if (!text) return null;
  const isLong = text.length > limit;
  const displayText = expanded ? text : text.slice(0, limit);

  return (
    <Typography sx={{ fontSize: 12.5, color: TEXT_MUTED, lineHeight: 1.5, mt: 0.75 }}>
      {displayText}
      {isLong && !expanded ? "…" : ""}
      {isLong && (
        <Button
          onClick={() => setExpanded((v) => !v)}
          sx={{
            ml: 0.75,
            p: 0,
            minWidth: "unset",
            fontSize: 12,
            fontWeight: 600,
            textTransform: "none",
            color: PRIMARY,
            "&:hover": { bgcolor: "transparent", textDecoration: "underline" },
          }}
        >
          {expanded ? "See Less" : "See More..."}
        </Button>
      )}
    </Typography>
  );
};

/* ── Circular score ring — track + value arc stacked, % centered ─────────── */
const CircularScore = ({ pct, tier, size = 58 }) => {
  return (
    <Box sx={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      {/* background track */}
      <CircularProgress
        variant="determinate"
        value={100}
        size={size}
        thickness={4}
        sx={{ color: BORDER, position: "absolute", left: 0 }}
      />
      {/* value arc */}
      <CircularProgress
        variant="determinate"
        value={pct}
        size={size}
        thickness={4}
        sx={{
          color: tier.ring,
          position: "absolute",
          left: 0,
          "& .MuiCircularProgress-circle": { strokeLinecap: "round" },
        }}
      />
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography sx={{ fontSize: 13, fontWeight: 800, color: tier.color, lineHeight: 1 }}>
          {pct}%
        </Typography>
      </Box>
    </Box>
  );
};

/* ── Single skill card ────────────────────────────────────────────────────── */
const SkillCard = ({ skillKey, score, notes }) => {
  const tier = getTier(score);
  const pct = Math.round(Math.min(Math.max(score, 0), 1) * 100);

  return (
    <Box
      sx={{
        background: "#fff",
        border: `1px solid ${BORDER}`,
        borderRadius: "14px",

        // Responsive padding
        p: { xs: 1.5, sm: 2 },

        display: "flex",
        alignItems: "flex-start",
        gap: { xs: 1, sm: 1.5 },

        width: "100%",
        minWidth: 0,
        boxSizing: "border-box",

        // Prevent content from affecting layout
        overflow: "hidden",

        transition: "border-color .15s ease, box-shadow .15s ease",

        "&:hover": {
          borderColor: PRIMARY,
          boxShadow: "0 4px 14px rgba(31,41,55,0.06)",
        },
      }}
    >
      {/* Score */}
      <CircularScore
        pct={pct}
        tier={tier}
        size={56}
      />

      {/* Content */}
      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          width: 0,
        }}
      >
        {/* Title + status */}
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 0.75,
            minWidth: 0,
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: 12.5, sm: 14 },
              fontWeight: 700,
              color: INK,
              lineHeight: 1.3,

              minWidth: 0,
              flex: 1,

              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {humanizeKey(skillKey)}
          </Typography>

          <Chip
            label={tier.label}
            size="small"
            sx={{
              height: 20,
              fontSize: { xs: 8.5, sm: 10 },
              fontWeight: 700,

              color: tier.color,
              bgcolor: tier.bg,
              border: `1px solid ${tier.border}`,

              flexShrink: 0,

              "& .MuiChip-label": {
                px: { xs: 0.7, sm: 1 },
              },
            }}
          />
        </Box>

        {/* Notes */}
        <NoteToggle text={notes} />
      </Box>
    </Box>
  );
};

/* ── Section wrapper ─────────────────────────────────────────────────────── */
const Section = ({ title, count, children }) => (
  <Box sx={{ mb: 3 }}>
    <Box sx={{ display: "flex", alignItems: "baseline", gap: 1, mb: 1.5 }}>
      <Typography sx={{ fontFamily: FONT_DISPLAY, fontSize: 17, fontWeight: 700, color: INK }}>
        {title}
      </Typography>
      <Typography sx={{ fontSize: 12.5, color: TEXT_MUTED }}>({count})</Typography>
    </Box>
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", lg: "1fr 1fr 1fr" },
        gap: 1.5,
      }}
    >
      {children}
    </Box>
  </Box>
);

const CandidateGapAnalysis = () => {
  const { data, isLoading, isFetching, isError, error, refetch } = useGetCandidateSkillsQuery();

  const { confirmed, possible, none, subFunction } = useMemo(() => {
    const skills = data?.data?.skills || {};
    const entries = Object.entries(skills).map(([key, val]) => ({
      key,
      score: val?.score ?? 0,
      notes: val?.ai_notes || "",
    }));
    entries.sort((a, b) => b.score - a.score);

    return {
      confirmed: entries.filter((e) => e.score >= 0.3),
      possible: entries.filter((e) => e.score > 0 && e.score < 0.3),
      none: entries.filter((e) => e.score === 0),
      subFunction: data?.data?.sub_function,
    };
  }, [data]);

  return (
    <Box
      sx={{
        background: SURFACE,
        border: `1px solid ${BORDER}`,
        borderRadius: "14px",
        p: { xs: 2.5, sm: 3 },
      }}
    >
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 1.5, mb: 2.5 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
          <Box
            sx={{
              width: 34,
              height: 34,
              borderRadius: "9px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: PRIMARY_TINT,
              color: PRIMARY_DARK,
            }}
          >
            <InsightsRoundedIcon sx={{ fontSize: 18 }} />
          </Box>
          <Box>
            <Typography sx={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 19, color: INK, lineHeight: 1.2 }}>
              Skill Gap Analysis
            </Typography>
            {subFunction && (
              <Typography sx={{ fontSize: 12.5, color: TEXT_MUTED, mt: 0.25 }}>
                Based on your resume for{" "}
                <Box component="span" sx={{ color: PRIMARY_DARK, fontWeight: 600 }}>
                  {subFunctionLabel(subFunction)}
                </Box>
              </Typography>
            )}
          </Box>
        </Box>
        {/* 
        <Button
          onClick={() => refetch()}
          disabled={isFetching}
          variant="outlined"
          size="small"
          startIcon={<RefreshRoundedIcon sx={{ fontSize: 16 }} />}
          sx={{
            borderColor: BORDER,
            color: PRIMARY_DARK,
            borderRadius: "10px",
            textTransform: "none",
            fontWeight: 600,
            fontSize: 12.5,
            "&:hover": { borderColor: PRIMARY, background: PRIMARY_TINT },
          }}
        >
          {isFetching ? "Refreshing…" : "Refresh"}
        </Button> */}
      </Box>

      {/* ── Loading state ──────────────────────────────────────────────── */}
      {isLoading && (
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", lg: "1fr 1fr 1fr" }, gap: 1.5 }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} variant="rounded" height={96} sx={{ borderRadius: "14px" }} />
          ))}
        </Box>
      )}

      {/* ── Error state ────────────────────────────────────────────────── */}
      {isError && !isLoading && (
        <Box
          sx={{
            border: `1px solid ${WARN_TINT}`,
            background: WARN_TINT,
            borderRadius: "10px",
            p: 2,
          }}
        >
          <Typography sx={{ fontSize: 13.5, color: WARN, fontWeight: 600 }}>
            Couldn't load your skill analysis.
          </Typography>
          <Typography sx={{ fontSize: 12.5, color: TEXT_MUTED, mt: 0.5 }}>
            {error?.data?.message || error?.error || "Please try again."}
          </Typography>
          <Button
            onClick={() => refetch()}
            size="small"
            sx={{ mt: 1, textTransform: "none", fontWeight: 600, color: PRIMARY_DARK }}
          >
            Retry
          </Button>
        </Box>
      )}

      {/* ── Empty state ────────────────────────────────────────────────── */}
      {!isLoading && !isError && confirmed.length + possible.length + none.length === 0 && (
        <Typography sx={{ fontSize: 13.5, color: TEXT_MUTED }}>
          No skill analysis available yet.
        </Typography>
      )}

      {/* ── Content ────────────────────────────────────────────────────── */}
      {!isLoading && !isError && (
        <>
          {confirmed.length > 0 && (
            <Section title="Confirmed Skills" count={confirmed.length}>
              {confirmed.map((s) => (
                <SkillCard key={s.key} skillKey={s.key} score={s.score} notes={s.notes} />
              ))}
            </Section>
          )}

          {possible.length > 0 && (
            <Section title="Possible Matches" count={possible.length}>
              {possible.map((s) => (
                <SkillCard key={s.key} skillKey={s.key} score={s.score} notes={s.notes} />
              ))}
            </Section>
          )}

          {none.length > 0 && (
            <Section title="Skill Gaps To Explore" count={none.length}>
              {none.map((s) => (
                <SkillCard key={s.key} skillKey={s.key} score={s.score} notes={s.notes} />
              ))}
            </Section>
          )}
        </>
      )}
    </Box>
  );
};

export default CandidateGapAnalysis;