import React from "react";
import { Box, Typography, Chip, Button, Divider } from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";

/* ── Brand tokens (shared with the rest of the candidate app) ── */
const INK = "#1F2937";
const TEXT_MUTED = "#6B7280";
const PRIMARY = "#2B6F71";
const PRIMARY_DARK = "#1E4F50";
const PRIMARY_TINT = "#EAF5F4";
const BORDER = "#E1E5E7";
const AMBER = "#B7791F";
const AMBER_TINT = "#FBF3E4";
const CLAY = "#B0433C";
const CLAY_TINT = "#FDEDEC";

/* ── Signature: an off-white "record paper" background + a monospace
   utility face for anything that reads like a data field (IDs, dates,
   counts) — a nod to the SDTM/ADaM data-listing world these roles live in ── */
const PAPER = "#FAF9F6";
const FONT_DISPLAY = "'Georgia', 'Times New Roman', serif";
const FONT_MONO =
  "'IBM Plex Mono', 'Fira Code', ui-monospace, SFMono-Regular, Menlo, monospace";

const formatDate = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return isNaN(d.getTime())
    ? "—"
    : d.toLocaleDateString(undefined, {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
};

/* Priority drives the tab colour on the left edge of the header — the one
   place this page spends its "boldness". */
const priorityColor = (priority) => {
  const p = (priority || "").toLowerCase();
  if (p === "high") return { fg: CLAY, bg: CLAY_TINT };
  if (p === "medium") return { fg: AMBER, bg: AMBER_TINT };
  if (p === "low") return { fg: PRIMARY, bg: PRIMARY_TINT };
  return { fg: TEXT_MUTED, bg: "#F3F4F6" };
};

/* A single "field" row inside the record sheet: LABEL ................ value */
const RecordField = ({ label, value }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "baseline",
      justifyContent: "space-between",
      gap: 1,
      py: 1,
      borderBottom: `1px dashed ${BORDER}`,
      "&:last-of-type": { borderBottom: "none" },
    }}
  >
    <Typography
      sx={{
        fontFamily: FONT_MONO,
        fontSize: 10.5,
        fontWeight: 600,
        color: TEXT_MUTED,
        textTransform: "uppercase",
        letterSpacing: 0.6,
        flexShrink: 0,
      }}
    >
      {label}
    </Typography>
    <Typography
      sx={{
        fontFamily: FONT_MONO,
        fontSize: 12.5,
        fontWeight: 600,
        color: INK,
        textAlign: "right",
      }}
    >
      {value}
    </Typography>
  </Box>
);

/* A requirement group rendered as a tinted rail with a coloured rule,
   rather than a floating row of generic chips — reads like a labelled
   section of a requirement matrix. */
const RequirementRail = ({ title, items, tone = "default" }) => {
  if (!items || items.length === 0 || (items.length === 1 && !items[0]))
    return null;

  const rail =
    tone === "mandatory" ? CLAY : tone === "primary" ? PRIMARY : "#B9C0C4";
  const chipTone =
    tone === "mandatory"
      ? { bgcolor: CLAY_TINT, border: `1px solid ${CLAY}30`, color: CLAY }
      : tone === "primary"
        ? {
            bgcolor: PRIMARY_TINT,
            border: `1px solid ${PRIMARY}30`,
            color: PRIMARY_DARK,
          }
        : { bgcolor: "#F3F4F6", border: `1px solid ${BORDER}`, color: INK };

  return (
    <Box
      sx={{ display: "flex", gap: 1.5, mb: 2.25, "&:last-of-type": { mb: 0 } }}
    >
      <Box sx={{ width: 3, borderRadius: 2, bgcolor: rail, flexShrink: 0 }} />
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          sx={{
            fontSize: 11,
            fontWeight: 700,
            color: INK,
            textTransform: "uppercase",
            letterSpacing: 0.6,
            mb: 1,
          }}
        >
          {title}
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
          {items.filter(Boolean).map((item, i) => (
            <Chip
              key={i}
              label={item}
              size="small"
              sx={{ height: 25, fontSize: 12, fontWeight: 600, ...chipTone }}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

/* ── Job details page ────────────────────────────────────────────────── */
const JobDetails = ({ job, applied, onBack, onApply }) => {
  if (!job) return null;

  const location =
    [job.city, job.country].filter(Boolean).join(", ") ||
    "Location not specified";
  const description =
    job.summary_final ||
    job.jobDescription ||
    job.summary_initial ||
    "No description provided.";
  const hasSalary = job.salary_range_min || job.salary_range_max;
  const tab = priorityColor(job.priority);

  const ApplyButton = ({ fullWidth = false }) => (
    <Button
      onClick={() => onApply(job)}
      disabled={applied}
      fullWidth={fullWidth}
      startIcon={
        applied ? <CheckCircleRoundedIcon sx={{ fontSize: 18 }} /> : null
      }
      sx={{
        textTransform: "none",
        fontWeight: 700,
        fontSize: 14,
        borderRadius: "8px",
        px: 3,
        py: 1.1,
        color: applied ? PRIMARY_DARK : "#fff",
        bgcolor: applied ? PRIMARY_TINT : PRIMARY,
        border: applied ? `1px solid ${PRIMARY}` : "none",
        "&:hover": { bgcolor: applied ? PRIMARY_TINT : PRIMARY_DARK },
        "&.Mui-disabled": { color: PRIMARY_DARK, bgcolor: PRIMARY_TINT },
      }}
    >
      {applied ? "Applied" : "Apply Now"}
    </Button>
  );

  return (
    <Box
      sx={{
        background: PAPER,
        border: `1px solid ${BORDER}`,
        borderRadius: "14px",
        overflow: "hidden",
        pb: { xs: 9, md: 0 }, // room for the fixed mobile apply bar
      }}
    >
      {/* Back bar */}
      <Box sx={{ px: { xs: 2, sm: 3 }, pt: 2 }}>
        <Button
          onClick={onBack}
          startIcon={<ArrowBackRoundedIcon sx={{ fontSize: 18 }} />}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            fontSize: 12.5,
            color: PRIMARY_DARK,
            pl: 0,
            minHeight: 0,
          }}
        >
          Back to Requisitions
        </Button>
      </Box>

      {/* Header — priority tab on the left, position id "stamped" top right */}
      <Box sx={{ display: "flex", px: { xs: 2, sm: 3 }, pt: 1.5 }}>
        <Box
          sx={{
            width: 4,
            borderRadius: 3,
            bgcolor: tab.fg,
            mr: { xs: 1.5, sm: 2.25 },
            flexShrink: 0,
          }}
        />

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 1.5,
              flexWrap: "wrap",
            }}
          >
            <Box sx={{ minWidth: 0 }}>
              <Typography
                sx={{
                  fontFamily: FONT_MONO,
                  fontSize: 10.5,
                  fontWeight: 700,
                  color: tab.fg,
                  textTransform: "uppercase",
                  letterSpacing: 1.4,
                }}
              >
                Requisition
              </Typography>
              <Typography
                sx={{
                  fontFamily: FONT_DISPLAY,
                  fontWeight: 700,
                  fontSize: { xs: 21, sm: 25 },
                  color: INK,
                  lineHeight: 1.2,
                  mt: 0.25,
                }}
              >
                {job.job_title}
              </Typography>
            </Box>

            {/* Position id, styled like a stamped record tag */}
            <Box
              sx={{
                fontFamily: FONT_MONO,
                fontSize: 11.5,
                fontWeight: 700,
                color: tab.fg,
                bgcolor: tab.bg,
                border: `1px solid ${tab.fg}40`,
                borderRadius: "6px",
                px: 1.25,
                py: 0.4,
                letterSpacing: 0.4,
                flexShrink: 0,
              }}
            >
              {job.job_position_id}
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "baseline",
              gap: 0.75,
              mt: 1,
              flexWrap: "wrap",
            }}
          >
            <Typography
              sx={{ fontSize: 14.5, fontWeight: 700, color: PRIMARY_DARK }}
            >
              {job.organisation?.organisation_name || "—"}
            </Typography>
            {job.organisation?.industry && (
              <Typography sx={{ fontSize: 12.5, color: TEXT_MUTED }}>
                · {job.organisation.industry}
              </Typography>
            )}
          </Box>

          <Box
            sx={{ display: "flex", alignItems: "center", gap: 0.6, mt: 0.5 }}
          >
            <PlaceRoundedIcon sx={{ fontSize: 15, color: TEXT_MUTED }} />
            <Typography sx={{ fontSize: 12.5, color: TEXT_MUTED }}>
              {location}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, mt: 1.5 }}>
            {job.job_type && (
              <Chip
                label={job.job_type}
                size="small"
                sx={{
                  height: 23,
                  fontSize: 11,
                  bgcolor: "#fff",
                  border: `1px solid ${BORDER}`,
                  color: INK,
                }}
              />
            )}
            {job.mode_of_work && (
              <Chip
                label={job.mode_of_work}
                size="small"
                sx={{
                  height: 23,
                  fontSize: 11,
                  bgcolor: "#fff",
                  border: `1px solid ${BORDER}`,
                  color: INK,
                }}
              />
            )}
            {(job.min_years || job.max_years) && (
              <Chip
                label={`${job.min_years ?? 0}–${job.max_years ?? "?"} yrs experience`}
                size="small"
                sx={{
                  height: 23,
                  fontSize: 11,
                  bgcolor: "#fff",
                  border: `1px solid ${BORDER}`,
                  color: INK,
                }}
              />
            )}
          </Box>
        </Box>
      </Box>

      <Divider
        sx={{
          borderColor: BORDER,
          borderStyle: "dashed",
          my: 2.5,
          mx: { xs: 2, sm: 3 },
        }}
      />

      {/* Body: content + record sheet */}
      <Box
        sx={{
          px: { xs: 2, sm: 3 },
          pb: { xs: 2, sm: 3 },
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 260px" },
          gap: { xs: 2.5, md: 3 },
          alignItems: "start",
        }}
      >
        {/* Left: description + requirement rails */}
        <Box sx={{ minWidth: 0 }}>
          <Box sx={{ mb: 3 }}>
            <Typography
              sx={{
                fontSize: 11,
                fontWeight: 700,
                color: TEXT_MUTED,
                textTransform: "uppercase",
                letterSpacing: 0.6,
                mb: 1,
              }}
            >
              About the Role
            </Typography>
            <Typography sx={{ fontSize: 13.5, color: INK, lineHeight: 1.75 }}>
              {description}
            </Typography>
          </Box>

          <Box
            sx={{
              background: "#fff",
              border: `1px solid ${BORDER}`,
              borderRadius: "10px",
              p: { xs: 2, sm: 2.5 },
            }}
          >
            <Typography
              sx={{
                fontSize: 11,
                fontWeight: 700,
                color: TEXT_MUTED,
                textTransform: "uppercase",
                letterSpacing: 0.6,
                mb: 2,
              }}
            >
              Skills &amp; Requirements
            </Typography>
            <RequirementRail
              title="Mandatory"
              items={job.mandatory}
              tone="mandatory"
            />
            <RequirementRail
              title="Primary"
              items={job.primary}
              tone="primary"
            />
            <RequirementRail
              title="Secondary"
              items={job.secondary}
              tone="default"
            />
            <RequirementRail
              title="Programming Skills"
              items={job.programming_skills}
              tone="default"
            />
          </Box>
        </Box>

        {/* Right: record sheet (sticky on desktop) */}
        <Box
          sx={{
            display: { xs: "none", md: "block" },
            position: "sticky",
            top: 16,
          }}
        >
          <Box
            sx={{
              background: "#fff",
              border: `1px solid ${BORDER}`,
              borderRadius: "10px",
              overflow: "hidden",
            }}
          >
            <Box sx={{ bgcolor: INK, px: 2, py: 1 }}>
              <Typography
                sx={{
                  fontFamily: FONT_MONO,
                  fontSize: 10.5,
                  fontWeight: 700,
                  color: "#fff",
                  textTransform: "uppercase",
                  letterSpacing: 1.2,
                }}
              >
                Record
              </Typography>
            </Box>
            <Box sx={{ px: 2, py: 0.5 }}>
              <RecordField
                label="Closes"
                value={formatDate(job.closing_date)}
              />
              <RecordField
                label="Openings"
                value={job.no_of_positions || "—"}
              />
              <RecordField label="Priority" value={job.priority || "—"} />
              {job.grade_or_level && (
                <RecordField label="Grade" value={job.grade_or_level} />
              )}
              {hasSalary && (
                <RecordField
                  label="Salary"
                  value={`${job.salary_range_min || "—"}–${job.salary_range_max || "—"} ${job.salary_unit || ""}`}
                />
              )}
              {job.workAuthorization && (
                <RecordField label="Work Auth" value={job.workAuthorization} />
              )}
            </Box>
            <Box sx={{ p: 2, pt: 1 }}>
              <ApplyButton fullWidth />
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Fixed apply bar — mobile / tablet only */}
      <Box
        sx={{
          display: { xs: "flex", md: "none" },
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1.5,
          px: 2,
          py: 1.25,
          background: "#fff",
          borderTop: `1px solid ${BORDER}`,
          boxShadow: "0 -6px 18px rgba(31,41,55,0.08)",
          zIndex: 10,
        }}
      >
        <Typography
          sx={{
            fontFamily: FONT_MONO,
            fontSize: 11,
            color: TEXT_MUTED,
            whiteSpace: "nowrap",
          }}
        >
          Closes {formatDate(job.closing_date)}
        </Typography>
        <ApplyButton />
      </Box>
    </Box>
  );
};

export default JobDetails;
