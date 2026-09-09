import React, { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Chip, Button, Skeleton } from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import BusinessRoundedIcon from "@mui/icons-material/BusinessRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import EventRoundedIcon from "@mui/icons-material/EventRounded";
import WorkOutlineRoundedIcon from "@mui/icons-material/WorkOutlineRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import PaidRoundedIcon from "@mui/icons-material/PaidRounded";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import { toast } from "react-toastify";
import { useGetMatchedJobsByCountryQuery } from "../../../services/candidateJobsApi.js"; // adjust path

/* ── Design tokens — same system as the requisitions list/card ── */
const INK = "#1F2937";
const TEXT_MUTED = "#6B7280";
const PRIMARY = "#2B6F71";
const PRIMARY_DARK = "#1E4F50";
const PRIMARY_TINT = "#EAF5F4";
const SURFACE = "#F8FAF9";
const BORDER = "#E1E5E7";
const WARN = "#B7791F";
const WARN_TINT = "#FBF3E4";
const FONT_DISPLAY = "'Georgia', 'Times New Roman', serif";

// Same list the requisitions page filters by — queried here in parallel
// since there's no get-job-by-id endpoint, only get-jobs-by-country.
const COUNTRY_OPTIONS = ["India", "US"];

const formatDate = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return isNaN(d.getTime())
    ? "—"
    : d.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
};

const scoreTier = (score) => {
  if (score >= 30) return { label: "SkillIntel Score", color: PRIMARY_DARK, bg: PRIMARY_TINT, border: PRIMARY };
  if (score > 0) return { label: "Possible Match", color: WARN, bg: WARN_TINT, border: "#E4C588" };
  return { label: "Low Match", color: TEXT_MUTED, bg: "#F3F4F6", border: BORDER };
};

const InfoRow = ({ icon: Icon, label, value }) => (
  <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.25, py: 1.1 }}>
    <Box
      sx={{
        width: 30, height: 30, borderRadius: "8px", flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        bgcolor: PRIMARY_TINT, color: PRIMARY_DARK,
      }}
    >
      <Icon sx={{ fontSize: 15 }} />
    </Box>
    <Box>
      <Typography sx={{ fontSize: 11, color: TEXT_MUTED, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.3 }}>
        {label}
      </Typography>
      <Typography sx={{ fontSize: 13.5, color: INK, fontWeight: 600, mt: 0.15 }}>
        {value || "—"}
      </Typography>
    </Box>
  </Box>
);

const DetailsSkeleton = () => (
  <Box sx={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: "14px", p: { xs: 2.5, sm: 3 } }}>
    <Skeleton width={90} height={28} sx={{ mb: 2 }} />
    <Skeleton width="60%" height={34} />
    <Skeleton width="35%" height={20} sx={{ mb: 2 }} />
    <Skeleton variant="rounded" height={160} sx={{ borderRadius: "12px" }} />
  </Box>
);

const CandidateReqisitionJobDetails = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [applied, setApplied] = useState(false);

  // Query every supported country in parallel and merge — same API the
  // list page uses, since there's no single get-job-by-id endpoint.
  const queries = COUNTRY_OPTIONS.map((country) =>
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useGetMatchedJobsByCountryQuery({ country, minScore: 80 })
  );

  const isLoading = queries.some((q) => q.isLoading);
  const isError = queries.every((q) => q.isError); // only a hard error if every country failed
  const firstError = queries.find((q) => q.isError)?.error;

  const job = useMemo(() => {
    for (const q of queries) {
      const found = q.data?.data?.jobs?.find((j) => j.job_id === jobId);
      if (found) return found;
    }
    return null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId, queries.map((q) => q.data).join("|")]);

  const handleApply = () => {
    setApplied(true);
    toast.success(`Applied — status changed for "${job.job_title}"`);
  };

  if (isLoading) {
    return <DetailsSkeleton />;
  }

  if (isError) {
    return (
      <Box sx={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: "14px", p: { xs: 2.5, sm: 3 } }}>
        <Button
          onClick={() => navigate(-1)}
          startIcon={<ArrowBackRoundedIcon sx={{ fontSize: 16 }} />}
          sx={{ textTransform: "none", fontWeight: 600, color: PRIMARY_DARK, mb: 2 }}
        >
          Back
        </Button>
        <Box sx={{ border: `1px solid ${WARN_TINT}`, background: WARN_TINT, borderRadius: "10px", p: 2 }}>
          <Typography sx={{ fontSize: 13.5, color: WARN, fontWeight: 600 }}>
            Couldn't load this job.
          </Typography>
          <Typography sx={{ fontSize: 12.5, color: TEXT_MUTED, mt: 0.5 }}>
            {firstError?.data?.message || firstError?.error || "Please try again."}
          </Typography>
        </Box>
      </Box>
    );
  }

  if (!job) {
    return (
      <Box sx={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: "14px", p: { xs: 2.5, sm: 3 } }}>
        <Button
          onClick={() => navigate(-1)}
          startIcon={<ArrowBackRoundedIcon sx={{ fontSize: 16 }} />}
          sx={{ textTransform: "none", fontWeight: 600, color: PRIMARY_DARK, mb: 2 }}
        >
          Back
        </Button>
        <Typography sx={{ fontSize: 13.5, color: TEXT_MUTED }}>
          This job couldn't be found — it may have closed or been removed.
        </Typography>
      </Box>
    );
  }

  const tier = scoreTier(job.skillintel_score);
  const location = [job.city, job.country].filter(Boolean).join(", ");
  const salaryLabel = job.salary_range_min || job.salary_range_max
    ? `${job.salary_range_min || "?"} – ${job.salary_range_max || "?"} ${job.salary_unit || ""}`.trim()
    : "Not disclosed";

  return (
    <Box sx={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: "14px", p: { xs: 2.5, sm: 3 } }}>
      <Button
        onClick={() => navigate(-1)}
        startIcon={<ArrowBackRoundedIcon sx={{ fontSize: 16 }} />}
        sx={{ textTransform: "none", fontWeight: 600, color: PRIMARY_DARK, mb: 2, px: 0 }}
      >
        Back to Matched Requisitions
      </Button>

      {/* ── Header card ── */}
      <Box sx={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: "14px", p: { xs: 2.25, sm: 2.75 } }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 1.5, flexWrap: "wrap" }}>
          <Box>
            <Typography sx={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 22, color: INK, lineHeight: 1.25 }}>
              {job.job_title}
            </Typography>
            <Typography sx={{ fontSize: 12.5, color: TEXT_MUTED, mt: 0.5 }}>
              {job.job_position_id}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mt: 1.25 }}>
              <BusinessRoundedIcon sx={{ fontSize: 17, color: PRIMARY }} />
              <Typography sx={{ fontSize: 14.5, fontWeight: 600, color: PRIMARY_DARK }}>
                {job.organisation?.organisation_name || "—"}
              </Typography>
              {job.organisation?.industry && (
                <Typography sx={{ fontSize: 12.5, color: TEXT_MUTED }}>· {job.organisation.industry}</Typography>
              )}
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mt: 0.75 }}>
              <PlaceRoundedIcon sx={{ fontSize: 16, color: TEXT_MUTED }} />
              <Typography sx={{ fontSize: 13, color: TEXT_MUTED }}>
                {location || "Location not specified"}
              </Typography>
            </Box>
          </Box>

          <Chip
            label={`${tier.label} · ${Math.round(job.skillintel_score)}%`}
            sx={{
              height: 30, fontSize: 12.5, fontWeight: 700,
              color: tier.color, bgcolor: tier.bg,
              border: `1px solid ${tier.border}`, flexShrink: 0,
            }}
          />
        </Box>

        {/* ── Quick tag chips ── */}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.85, mt: 2 }}>
          {job.job_type && <Chip label={job.job_type} size="small" sx={{ height: 24, fontSize: 11.5, bgcolor: SURFACE, border: `1px solid ${BORDER}`, color: INK }} />}
          {job.mode_of_work && <Chip label={job.mode_of_work} size="small" sx={{ height: 24, fontSize: 11.5, bgcolor: SURFACE, border: `1px solid ${BORDER}`, color: INK }} />}
          {(job.min_years || job.max_years) && (
            <Chip label={`${job.min_years ?? 0}–${job.max_years ?? "?"} yrs experience`} size="small" sx={{ height: 24, fontSize: 11.5, bgcolor: SURFACE, border: `1px solid ${BORDER}`, color: INK }} />
          )}
          {job.priority && (
            <Chip label={`${job.priority} priority`} size="small" sx={{ height: 24, fontSize: 11.5, bgcolor: "#FDEDEC", border: "1px solid #F3C9C4", color: "#B0433C", fontWeight: 600 }} />
          )}
          <Chip label={job.status === "open" ? "Open" : job.status} size="small" sx={{ height: 24, fontSize: 11.5, fontWeight: 600, bgcolor: job.status === "open" ? "#E9F7EF" : "#F3F4F6", border: `1px solid ${job.status === "open" ? "#BFE6CC" : BORDER}`, color: job.status === "open" ? "#1E7E42" : TEXT_MUTED }} />
        </Box>

        {/* ── Details grid ── */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            columnGap: 3,
            mt: 1.5,
            pt: 1.5,
            borderTop: `1px solid ${BORDER}`,
          }}
        >
          <InfoRow icon={WorkOutlineRoundedIcon} label="No. of Positions" value={job.no_of_positions} />
          <InfoRow icon={PaidRoundedIcon} label="Salary" value={salaryLabel} />
          <InfoRow icon={GroupsRoundedIcon} label="Grade / Level" value={job.grade_or_level} />
          <InfoRow icon={CalendarTodayRoundedIcon} label="Posted" value={formatDate(job.posted_at)} />
          <InfoRow icon={EventRoundedIcon} label="Closing Date" value={formatDate(job.closing_date)} />
        </Box>

        {/* ── Actions ── */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 2.5, pt: 2, borderTop: `1px solid ${BORDER}` }}>
          <Button
            onClick={() => navigate(-1)}
            sx={{ textTransform: "none", fontWeight: 600, fontSize: 13, color: PRIMARY_DARK, border: `1px solid ${BORDER}`, borderRadius: "9px", px: 2.5 }}
          >
            Back
          </Button>
          <Button
            onClick={handleApply}
            disabled={applied}
            startIcon={applied ? <CheckCircleRoundedIcon sx={{ fontSize: 16 }} /> : null}
            sx={{
              textTransform: "none", fontWeight: 700, fontSize: 13, borderRadius: "9px", px: 3,
              color: applied ? PRIMARY_DARK : "#fff",
              bgcolor: applied ? PRIMARY_TINT : PRIMARY,
              border: applied ? `1px solid ${PRIMARY}` : "none",
              "&:hover": { bgcolor: applied ? PRIMARY_TINT : PRIMARY_DARK },
              "&.Mui-disabled": { color: PRIMARY_DARK, bgcolor: PRIMARY_TINT },
            }}
          >
            {applied ? "Applied" : "Apply Now"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default CandidateReqisitionJobDetails;