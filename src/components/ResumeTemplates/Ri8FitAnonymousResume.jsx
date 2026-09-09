import React, { forwardRef, useEffect, useState } from "react";
import { Box, Typography, Divider } from "@mui/material";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import logoDark from "../../assets/ri8fit-logo.svg";

/* ================= DESIGN TOKENS ================= */
const T = {
  navy: "#0F2A4A", // section heading text
  accent: "#1A56A0", // accent bar, labels, links
  accentBg: "#EEF4FB", // tinted card backgrounds
  muted: "#64748B", // meta / secondary text
  body: "#1E293B", // body text
  border: "#CBD5E1", // dividers
  mandatory: "#62048a",
  primary: "#2196F3",
  secondary: "#A26666",
};

/* ================= UTILITIES ================= */
const normalize = (v = "") =>
  String(v)
    .toLowerCase()
    .replace(/\bii\b/g, "2")
    .replace(/\biii\b/g, "3")
    .replace(/\biv\b/g, "4")
    .replace(/[^a-z0-9]/g, "")
    .trim();

/* ================= MAIN COMPONENT ================= */
const Ri8FitAnonymousResume = forwardRef(({ data, isPdfMode = false }, ref) => {
  const [secureBlur, setSecureBlur] = useState(false);

  useEffect(() => {
    const onBlur = () => setSecureBlur(true);
    const onFocus = () => setSecureBlur(false);
    const onVisibility = () => setSecureBlur(document.hidden);
    window.addEventListener("blur", onBlur);
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  useEffect(() => {
    const blockKeys = (e) => {
      if (e.key === "PrintScreen") {
        navigator.clipboard.writeText("");
        alert("Screenshots are disabled for confidential profiles.");
      }
      if (e.ctrlKey && e.key.toLowerCase() === "p") e.preventDefault();
      if (e.ctrlKey && e.key.toLowerCase() === "s") e.preventDefault();
      if (e.ctrlKey && e.shiftKey && ["i", "c"].includes(e.key.toLowerCase()))
        e.preventDefault();
      if (e.key === "F12") e.preventDefault();
    };
    document.addEventListener("keydown", blockKeys);
    return () => document.removeEventListener("keydown", blockKeys);
  }, []);

const getSkillColor = (skill) => {
  const m = (data?.matched_mandatory_skills || []).map(normalize);
  const p = (data?.matched_primary_skills || []).map(normalize);
  const s = (data?.matched_secondary_skills || []).map(normalize);

  const normalizedSkill = normalize(skill);

  if (m.includes(normalizedSkill)) return T.mandatory;
  if (p.includes(normalizedSkill)) return T.primary;
  if (s.includes(normalizedSkill)) return T.secondary;

  return T.body;
};

  if (!data?.candidate)
    return <Typography>No resume data available</Typography>;

  const scoreIntel = Array.isArray(data?.score_intel)
    ? data.score_intel.map((item) => ({
        ...item,
        candidate: Math.round(item.candidate),
        desired: Math.round(item.desired),
      }))
    : [];

  const candidate = data.candidate;
  const employment = [...(candidate.employment || [])].sort((a, b) =>
    a.is_current ? -1 : b.is_current ? 1 : 0,
  );
  const education = candidate.education || [];
  const skillInfo = candidate.skill_info?.[0] || {};

  const mandatorySkills = data.matched_mandatory_skills || [];
  const secondarySkills = data.matched_secondary_skills || [];
  const skillNotes = data?.skill_notes || {};

  const formattedSkillNotes = Object.entries(skillNotes).map(
    ([key, value]) => ({
      label: key,
      value,
    }),
  );

  const skillScore = skillInfo?.skillintel_score;
  const latestJob = employment[0];
  const totalYears = latestJob?.total_exp_years ?? 0;
  const totalMonths = latestJob?.total_exp_months ?? 0;

  const keySkills = (skillInfo.key_skills || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const normalizedMandatory = mandatorySkills.map(normalize);
  const normalizedSecondary = secondarySkills.map(normalize);
  const remainingSkills = keySkills.filter(
    (s) =>
      !normalizedMandatory.includes(normalize(s)) &&
      !normalizedSecondary.includes(normalize(s)),
  );

  /* ===== Custom radar axis label ===== */
  const CustomAngleLabel = ({ payload, x, y, cx, cy }) => {
    if (!payload?.value) return null;
    const label = payload.value;
    const truncated = label.length > 14 ? label.slice(0, 12) + "…" : label;
    const angle = Math.atan2(y - cy, x - cx);
    const offset = isPdfMode ? 42 : 30;
    return (
      <text
        x={x + Math.cos(angle) * offset}
        y={y + Math.sin(angle) * offset}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={10}
        fontWeight={700}
        fill={getSkillColor(label)}
      >
        {truncated}
      </text>
    );
  };

  /* ===== shared avoid-break style ===== */
  const noBreak = {
    pageBreakInside: "avoid",
    breakInside: "avoid",
    orphans: 3,
    widows: 3,
  };

  /* ================= RENDER ================= */
  return (
    <Box
      id="ri8fit-resume-root"
      ref={ref}
      onContextMenu={(e) => e.preventDefault()}
      onCopy={(e) => e.preventDefault()}
      sx={{
        maxWidth: 820,
        mx: "auto",
        background: "#fff",
        px: "44px",
        pt: "36px",
        pb: "28px",
        fontFamily: `"Inter","Roboto","Arial",sans-serif`,
        userSelect: "none",
        filter: secureBlur ? "blur(8px)" : "none",
        transition: "filter 0.15s ease",
        position: "relative",
        overflow: "hidden",
        lineHeight: 1.5,
        color: T.body,
      }}
    >
      {/* ===== HEADER ===== */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1.5,
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: 22,
              fontWeight: 900,
              color: T.navy,
              letterSpacing: "-0.3px",
              lineHeight: 1.2,
            }}
          >
            Ri8Fit Candidate Summary
          </Typography>
          <Typography
            sx={{
              fontSize: 12,
              color: T.muted,
              mt: 0.25,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            Generated by Ri8Fit AI
          </Typography>
        </Box>
        <Box
          component="img"
          src={logoDark}
          alt="Ri8Fit Logo"
          sx={{ height: 50, width: "auto", objectFit: "contain" }}
        />
      </Box>

      {/* navy accent rule under header */}
      <Box
        sx={{
          height: 3,
          background: `linear-gradient(90deg, ${T.accent} 0%, ${T.accentBg} 100%)`,
          borderRadius: 2,
          mb: 1.5,
        }}
      />

      {/* ===== CANDIDATE META STRIP ===== */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr",
          gap: "0 12px",
          background: T.accentBg,
          border: `1px solid #BFDBFE`,
          borderRadius: "6px",
          px: 2,
          py: 1.25,
          mb: 1.5,
          ...noBreak,
        }}
      >
        <MetaCell label="Candidate ID" value={`CLIN${candidate.clin_id}`} />
        <MetaCell label="Experience" value={`${totalYears}y ${totalMonths}m`} />
        <MetaCell
          label="Location"
          value={latestJob?.location || "Not Disclosed"}
        />

        <MetaCell
          label="SkillIntel"
          value={
            skillScore !== null && skillScore !== undefined
              ? (skillScore)
              : "N/A"
          }
          highlight
        />
      </Box>

      {/* ===== PROFESSIONAL SUMMARY ===== */}
      <SectionBlock title="Professional Summary">
        <Typography
          sx={{
            fontSize: 13.5,
            lineHeight: 2,
            color: T.body,
            textAlign: "justify",
          }}
        >
          {skillInfo.summary ||
            "Profile evaluated and anonymized by Ri8Fit AI."}
        </Typography>
      </SectionBlock>

      {/* ===== SKILL INTELLIGENCE SNAPSHOT ===== */}
      <SectionBlock title="Skill Intelligence Snapshot">
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "200px 1fr",
            gap: 2,
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Box
              sx={{
                display: "inline-flex",
                flexDirection: "column",
                alignItems: "center",
                background: T.accentBg,
                border: `1px solid #BFDBFE`,
                borderRadius: "8px",
                px: 2.5,
                py: 1.5,
              }}
            >
              <Typography
                sx={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: T.accent,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                SkillIntel Score
              </Typography>
              <Typography
                sx={{
                  fontSize: 32,
                  fontWeight: 900,
                  color: T.navy,
                  lineHeight: 1.1,
                  mt: 0.25,
                }}
              >
                {skillScore !== null && skillScore !== undefined
                  ? (skillScore)
                  : "—"}
              </Typography>
              <Typography sx={{ fontSize: 11, color: T.muted }}>
                out of 100
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
             width: isPdfMode ? "108%" : "100%",
ml: isPdfMode ? "-4%" : 0,
overflow: "visible",
            }}
          >
            {scoreIntel.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={isPdfMode ? 360 : 240}>
        <RadarChart
          data={scoreIntel}
          cx={isPdfMode ? "47%" : "50%"}
          cy="50%"
          outerRadius={isPdfMode ? "53%" : "60%"}
          margin={
            isPdfMode
              ? { top: 70, right: 85, bottom: 70, left: 120 }
              : { top: 40, right: 55, bottom: 40, left: 55 }
          }
        >
                    <defs>
                      <radialGradient id="candGrad" cx="50%" cy="50%" r="70%">
                        <stop
                          offset="0%"
                          stopColor="#3B82F6"
                          stopOpacity={0.45}
                        />
                        <stop
                          offset="100%"
                          stopColor="#3B82F6"
                          stopOpacity={0.06}
                        />
                      </radialGradient>
                    </defs>

                    <PolarGrid stroke="#E2E8F0" />
                    <PolarRadiusAxis
                      domain={[0, 100]}
                      tickCount={6}
                      tick={{ fontSize: 8, fill: T.muted }}
                      axisLine={false}
                      tickLine={false}
                    />

                    <PolarAngleAxis
                      dataKey="skill"
                      tick={(props) => <CustomAngleLabel {...props} />}
                    />

                    <Radar
                      name="Desired"
                      dataKey="desired"
                      stroke="#86EFAC"
                      strokeWidth={1.5}
                      strokeDasharray="5 4"
                      fill="transparent"
                    />

                    <Radar
                      name="Candidate"
                      dataKey="candidate"
                      stroke="#3B82F6"
                      strokeWidth={2}
                      fill="url(#candGrad)"
                      dot={{ r: 3, fill: "#3B82F6", strokeWidth: 0 }}
                    />

                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 6 }} />
                  </RadarChart>
                </ResponsiveContainer>

                {/* Legend BELOW chart */}
                <Box
                  sx={{
                    mt: 1,
                    display: "flex",
                    justifyContent: "center",
                    gap: 3,
                  }}
                >
                  {[
                    ["Mandatory", T.mandatory],
                    ["Primary", T.primary],
                    ["Secondary", T.secondary],
                  ].map(([label, color]) => (
                    <Box
                      key={label}
                      sx={{ display: "flex", alignItems: "center", gap: 0.6 }}
                    >
                      <Box
                        sx={{
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          bgcolor: color,
                        }}
                      />
                      <Typography sx={{ fontSize: 11 }}>{label}</Typography>
                    </Box>
                  ))}
                </Box>
              </>
            ) : (
              <Typography sx={{ fontSize: 12, color: T.muted }}>
                No SkillIntel data
              </Typography>
            )}
          </Box>
        </Box>
      </SectionBlock>

      {/* ===== SKILLS SUMMARY ===== */}
      <SectionBlock title="Skills Summary">
        {formattedSkillNotes.map((item, index) => {
          const scoreItem = scoreIntel.find(
            (s) => s.skill?.toLowerCase() === item.label?.toLowerCase(),
          );
          const score = scoreItem ? Math.round(scoreItem.candidate) : "N/A";
          return (
            <Box
              key={index}
              sx={{
                display: "grid",
                gridTemplateColumns: "180px 1fr",
                gap: 1.5,
                mb: 1.2,
                alignItems: "start",
                ...noBreak,
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  background: T.accentBg,
                  border: `1px solid #BFDBFE`,
                  borderRadius: "4px",
                  px: 1,
                  py: 0.6,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Typography
                  sx={{
                    fontSize: 11,
                    fontWeight: 800,
                    color: T.accent,
                    lineHeight: 1.4,
                    wordBreak: "break-word",
                    whiteSpace: "normal",
                  }}
                >
                  {item.label} · {score}%
                </Typography>
              </Box>
              <Typography
                sx={{
                  fontSize: 13,
                  lineHeight: 1.8,
                  color: T.body,
                  textAlign: "justify",
                }}
              >
                {item.value}
              </Typography>
            </Box>
          );
        })}
      </SectionBlock>

      {/* ===== CORE COMPETENCIES ===== */}
      {remainingSkills.length > 0 && (
        <SectionBlock title="Core Competencies">
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: "6px 8px" }}>
            {remainingSkills.map((skill, i) => (
              <Box
                key={i}
                sx={{
                  fontSize: 12,
                  color: T.body,
                  background: "#F8FAFC",
                  border: `1px solid ${T.border}`,
                  borderRadius: "4px",
                  px: 1,
                  py: "2px",
                  lineHeight: 1.5,
                }}
              >
                {skill}
              </Box>
            ))}
          </Box>
        </SectionBlock>
      )}

      {/* ===== PROFESSIONAL EXPERIENCE ===== */}
      <SectionBlock title="Professional Experience">
        {employment.map((job, idx) => (
          <Box key={idx} sx={{ mb: 2.6, ...noBreak }}>
            {/* job header row */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                mb: 0.2,
              }}
            >
              <Typography
                sx={{
                  fontSize: 14.5,
                  fontWeight: 800,
                  color: T.navy,
                  textTransform: "capitalize",
                  lineHeight: 1.3,
                }}
              >
                {job.job_title}
              </Typography>
              <Typography
                sx={{
                  fontSize: 11.5,
                  color: T.muted,
                  whiteSpace: "nowrap",
                  ml: 1,
                  fontWeight: 500,
                }}
              >
                {job.joining_date} – {job.end_date}
              </Typography>
            </Box>

            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.75 }}
            >
              <Typography
                sx={{
                  fontSize: 13,
                  color: T.accent,
                  fontWeight: 600,
                  textTransform: "capitalize",
                }}
              >
                {job.company_name}
              </Typography>
              {job.location && (
                <>
                  <Box
                    sx={{
                      width: 3,
                      height: 3,
                      borderRadius: "50%",
                      background: T.border,
                    }}
                  />
                  <Typography
                    sx={{
                      fontSize: 12,
                      color: T.muted,
                      textTransform: "capitalize",
                    }}
                  >
                    {job.location}
                  </Typography>
                </>
              )}
              {job.duration && (
                <>
                  <Box
                    sx={{
                      width: 3,
                      height: 3,
                      borderRadius: "50%",
                      background: T.border,
                    }}
                  />
                  <Typography sx={{ fontSize: 12, color: T.muted }}>
                    {job.duration}
                  </Typography>
                </>
              )}
            </Box>

            {job.key_responsibilities && (
              <Box
                sx={{
                  borderLeft: `3px solid ${T.accent}`,
                  background: T.accentBg,
                  px: 1.5,
                  py: 1,
                  borderRadius: "0 4px 4px 0",
                  ...noBreak,
                }}
              >
                <Typography
                  sx={{
                    fontSize: 11,
                    fontWeight: 800,
                    color: T.accent,
                    textTransform: "uppercase",
                    letterSpacing: "0.07em",
                    mb: 0.4,
                  }}
                >
                  Key Responsibilities
                </Typography>
                <Typography
                  sx={{
                    fontSize: 12.5,
                    color: T.body,
                    lineHeight: 1.8,
                    textAlign: "justify",
                  }}
                >
                  {job.key_responsibilities}
                </Typography>
              </Box>
            )}
          </Box>
        ))}
      </SectionBlock>

      {/* ===== EDUCATION ===== */}
      <SectionBlock title="Education">
        {education.map((edu, idx) => (
          <Box
            key={idx}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              mb: 0.75,
              ...noBreak,
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontSize: 13.5,
                  fontWeight: 700,
                  color: T.navy,
                  textTransform: "capitalize",
                }}
              >
                {edu.course}
              </Typography>
              <Typography
                sx={{
                  fontSize: 12.5,
                  color: T.muted,
                  textTransform: "capitalize",
                }}
              >
                {edu.university}
              </Typography>
            </Box>
            {edu.end_year && (
              <Typography
                sx={{
                  fontSize: 12,
                  color: T.muted,
                  fontWeight: 600,
                  ml: 1,
                  whiteSpace: "nowrap",
                }}
              >
                {edu.end_year}
              </Typography>
            )}
          </Box>
        ))}
      </SectionBlock>

      {/* ===== FOOTER ===== */}
      <Box
        sx={{
          mt: 1.5,
          pt: 1,
          borderTop: `1px solid ${T.border}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography sx={{ fontSize: 10.5, color: T.muted }}>
          Ri8Fit · Generated by AI evaluation
        </Typography>
      </Box>
    </Box>
  );
});

/* ================= HELPERS ================= */

/** Accent-bar section heading */
const SectionBlock = ({ title, children }) => (
  <Box sx={{ mt: 2.5, mb: 0, pageBreakInside: "avoid", breakInside: "avoid" }}>
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.2 }}>
      <Box
        sx={{
          width: 4,
          height: 18,
          background: "#1A56A0",
          borderRadius: "2px",
          flexShrink: 0,
        }}
      />
      <Typography
        sx={{
          fontSize: 13,
          fontWeight: 800,
          color: "#0F2A4A",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
        }}
      >
        {title}
      </Typography>
    </Box>
    <Box sx={{ borderTop: "1.5px solid #CBD5E1", mb: 1.5 }} />
    {children}
  </Box>
);

/** Compact meta cell */
const MetaCell = ({ label, value, highlight }) => (
  <Box>
    <Typography
      sx={{
        fontSize: 10,
        fontWeight: 700,
        color: "#64748B",
        textTransform: "uppercase",
        letterSpacing: "0.07em",
        mb: 0.1,
      }}
    >
      {label}
    </Typography>
    <Typography
      sx={{
        fontSize: 13.5,
        fontWeight: 700,
        color: highlight ? "#1A56A0" : "#0F2A4A",
      }}
    >
      {value}
    </Typography>
  </Box>
);

export default Ri8FitAnonymousResume;
