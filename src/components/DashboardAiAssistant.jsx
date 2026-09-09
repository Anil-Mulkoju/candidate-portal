import React, { memo, useEffect, useMemo, useRef, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  IconButton,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
import CloseIcon from "@mui/icons-material/Close";
import { format } from "date-fns";



// Same RTK Query slice as the real JobRequirements.jsx page.
import {
  useGetCountriesQuery,
  useGetLocationsByCountryQuery,
  useGetEdcToolsQuery,
  useGetTherapeuticAreasQuery,
  useGetUsersByRoleQuery,
  useGetClinicalSubFunctionsQuery,
  useGetPrimarySkillsQuery,
  useGetNormalSkillsQuery,
  useGetMandatorySkillsQuery,
  useGetSecondarySkillsMutation,
  useGetRaveProgrammerSkillsQuery,
  useGetRaveProgrammerSecondarySkillsMutation,
  useCreateJobMutation,
  useLazyGetPrimarySkillsQuery,
} from "../store/api/jobApi";
import { useLazyGetMatchingCandidatesQuery } from "../store/api/CandidateApi";
import { PRODUCT_KNOWLEDGE_BASE } from "./aiAssistant/knowledgeBase";
import { retrieveAnswer } from "./aiAssistant/retrieval";

// ─────────────────────────────────────────────────────────────────────────
// Constants — copied from JobRequirements.jsx so the chat wizard offers
// exactly the same choices and hits exactly the same endpoints.
// ─────────────────────────────────────────────────────────────────────────
const DOMAINS = [
  { value: "clinical", label: "Clinical" },
  { value: "it", label: "IT" },
  { value: "non_it", label: "Non-IT" },
];

const FUNCTIONS = [
  { label: "Bio Statistics", key: "biostatistics" },
  { label: "Clinical Data Management", key: "clinical data management" },
];

const DOMAIN_SKILLS = {
  it: [
    { key: "javascript", label: "JavaScript" }, { key: "typescript", label: "TypeScript" },
    { key: "react", label: "React.js" }, { key: "node", label: "Node.js" },
    { key: "python", label: "Python" }, { key: "java", label: "Java" },
    { key: "dotnet", label: ".NET / C#" }, { key: "sql", label: "SQL" },
    { key: "aws", label: "AWS" }, { key: "azure", label: "Azure" },
    { key: "gcp", label: "GCP" }, { key: "docker", label: "Docker" },
    { key: "kubernetes", label: "Kubernetes" }, { key: "devops", label: "DevOps" },
    { key: "ci_cd", label: "CI/CD" }, { key: "machine_learning", label: "Machine Learning" },
    { key: "data_science", label: "Data Science" }, { key: "cybersecurity", label: "Cybersecurity" },
    { key: "qa_testing", label: "QA & Testing" }, { key: "mobile_dev", label: "Mobile Development" },
    { key: "ui_ux", label: "UI/UX Design" }, { key: "agile_scrum", label: "Agile / Scrum" },
    { key: "project_mgmt", label: "Project Management" }, { key: "blockchain", label: "Blockchain" },
    { key: "other", label: "Other" },
  ],
  non_it: [
    { key: "accounting", label: "Accounting" }, { key: "finance", label: "Finance" },
    { key: "hr_management", label: "HR Management" }, { key: "recruitment", label: "Recruitment" },
    { key: "legal", label: "Legal" }, { key: "compliance", label: "Compliance" },
    { key: "supply_chain", label: "Supply Chain" }, { key: "logistics", label: "Logistics" },
    { key: "procurement", label: "Procurement" }, { key: "operations", label: "Operations" },
    { key: "admin", label: "Administration" }, { key: "customer_service", label: "Customer Service" },
    { key: "communication", label: "Communication" }, { key: "ms_office", label: "MS Office" },
    { key: "erp", label: "ERP Systems" }, { key: "data_analysis", label: "Data Analysis" },
    { key: "training", label: "Training & Dev" }, { key: "other", label: "Other" },
  ],
};

const availabilityOptions = [
  { value: "0", label: "Immediately Available" },
  { value: "30", label: "Less Than 30 days" },
  { value: "60", label: "Less Than 60 days" },
  { value: "90", label: "Less Than 90 days" },
];
const jobTypeOptions = ["Full Time", "Part Time", "Freelancer"];
const modeOfWorkOptions = ["Remote", "Hybrid", "Onsite"];
const priorityOptions = ["High", "Medium", "Low"];

const SUB_FUNCTION_SHORT_CODES = {
  "Clinical Data Manager": "CDM",
  "Statistical Programmer": "SP",
  "Clinical Programmer/CRF Developer": "CRF",
  "Bio Statistician": "BIO",
};
const generateJobTitle = (subFunction) => {
  const short = SUB_FUNCTION_SHORT_CODES[subFunction] || "";
  if (!short) return "";
  const now = new Date();
  const date = String(now.getDate()).padStart(2, "0") + String(now.getMonth() + 1).padStart(2, "0") + String(now.getFullYear()).slice(-2);
  const time = String(now.getHours()).padStart(2, "0") + String(now.getMinutes()).padStart(2, "0");
  return `${short}-${date}${time}`;
};
const getTodayPlus30Days = () => { const d = new Date(); d.setDate(d.getDate() + 30); return d; };


const formatAvailability = (value) => {
  const match = availabilityOptions.find((o) => o.value === String(value));
  return match ? match.label : (value ? `${value} days` : "—");
};
// ─────────────────────────────────────────────────────────────────────────
// Ordered wizard steps + which ones apply for the current draft
// (mirrors the branching in JobRequirements.jsx's validateStep0 / render)
// ─────────────────────────────────────────────────────────────────────────
const STEP = {
  DOMAIN: "DOMAIN", POSITIONS: "POSITIONS", FUNCTION: "FUNCTION", SUBFUNCTION: "SUBFUNCTION",
  TITLE: "TITLE", MIN_EXP: "MIN_EXP", MAX_EXP: "MAX_EXP", AVAILABILITY: "AVAILABILITY",
  COUNTRY: "COUNTRY", CITY: "CITY", SKILL_MODE: "SKILL_MODE", NORMAL_SKILLS: "NORMAL_SKILLS",
  PRIMARY_SKILLS: "PRIMARY_SKILLS", MANDATORY_SKILLS: "MANDATORY_SKILLS", SECONDARY_SKILLS: "SECONDARY_SKILLS",
  EDC_TOOLS: "EDC_TOOLS", THERAPEUTIC: "THERAPEUTIC", DOMAIN_SKILLS: "DOMAIN_SKILLS",
  JOB_TYPE: "JOB_TYPE", MODE_OF_WORK: "MODE_OF_WORK", PRIORITY: "PRIORITY", CLOSING_DATE: "CLOSING_DATE",
  SALARY: "SALARY", APPROVER: "APPROVER", RECRUITERS: "RECRUITERS", INSTRUCTIONS: "INSTRUCTIONS", REVIEW: "REVIEW",
};
const STEP_ORDER = [
  STEP.DOMAIN, STEP.POSITIONS, STEP.FUNCTION, STEP.SUBFUNCTION, STEP.TITLE, STEP.MIN_EXP, STEP.MAX_EXP,
  STEP.AVAILABILITY, STEP.COUNTRY, STEP.CITY, STEP.SKILL_MODE, STEP.NORMAL_SKILLS, STEP.PRIMARY_SKILLS,
  STEP.MANDATORY_SKILLS, STEP.SECONDARY_SKILLS, STEP.EDC_TOOLS, STEP.THERAPEUTIC, STEP.DOMAIN_SKILLS,
  STEP.JOB_TYPE, STEP.MODE_OF_WORK, STEP.PRIORITY, STEP.CLOSING_DATE, STEP.SALARY, STEP.APPROVER,
  STEP.RECRUITERS, STEP.INSTRUCTIONS, STEP.REVIEW,
];

function stepApplies(stepId, draft) {
  const isClinical = draft.domain === "clinical";
  const isCDM = draft.functionLabel === "Clinical Data Management";
  const isCPSub = draft.subFunctionLabel === "Clinical Programmer/CRF Developer";
  switch (stepId) {
    case STEP.FUNCTION:
    case STEP.SUBFUNCTION:
    case STEP.SKILL_MODE:
      return isClinical;
    case STEP.NORMAL_SKILLS:
      return isClinical && draft.skillMode === "normal";
    case STEP.PRIMARY_SKILLS:
      return isClinical && draft.skillMode === "advanced" && !isCDM;
    case STEP.MANDATORY_SKILLS:
    case STEP.SECONDARY_SKILLS:
      return isClinical && draft.skillMode === "advanced";
    case STEP.EDC_TOOLS:
      return isClinical && draft.skillMode === "advanced" && (draft.subFunctionLabel === "Clinical Data Manager" || isCPSub);
    case STEP.THERAPEUTIC:
      return isClinical && isCDM;
    case STEP.DOMAIN_SKILLS:
      return draft.domain !== "" && draft.domain !== "clinical";
    default:
      return true;
  }
}
const nextStep = (current, draft) => {
  let i = STEP_ORDER.indexOf(current) + 1;
  while (i < STEP_ORDER.length && !stepApplies(STEP_ORDER[i], draft)) i++;
  return i < STEP_ORDER.length ? STEP_ORDER[i] : STEP.REVIEW;
};
const reached = (jobStep, target) => jobStep != null && STEP_ORDER.indexOf(jobStep) >= STEP_ORDER.indexOf(target);

const emptyDraft = {
  domain: "", noOfPositions: "One", functionLabel: "", functionKey: "",
  subFunctionLabel: "", subFunctionKey: "",
  designation: "", min: "", max: "", availability: availabilityOptions[1],
  country: "India", city: "",
  skillMode: "normal", normalSkills: [], primarySkills: [], mandatorySkills: [], secondarySkills: [],
  cpmSkills: [], cpsSkills: [], edcTools: [], therapeuticExperience: [], domainSkills: [],
  jobType: "Full Time", modeOfWork: "Onsite", priority: "High", closingDate: getTodayPlus30Days(),
  salaryUnit: "", salaryRange: "",
  selectedManager: null, selectedRecruiters: [],
  instructions: "", file: null,
};

const pageInfo = (path) => {
  if (path.includes("/create-job")) return { name: "Create Job", prompts: ["Start job creation"] };
  if (path.includes("/candidates")) return { name: "Candidates", prompts: ["Show candidate CLIN123", "Create a job"] };
  if (path.includes("/requisitions/Job-details")) return { name: "Job Details", prompts: ["Create a job"] };
  if (path.includes("/requisitions")) return { name: "Requisitions", prompts: ["How does pipeline work?", "Create a job"] };
  if (path.includes("/interviews")) return { name: "Interviews", prompts: ["Show interview flow", "View timeline", "Review candidates", "Create a job"] };
  return { name: "Dashboard", prompts: ["Shortlisted count", "Onboarded candidates", "Create a job"] };
};
// Dashboard analytics fields aren't always plain numbers — the same
// candidate_stage_breakdown.* values the Dashboard page reads via its own
// getSafeCount() can come back as { total, value, ... } objects instead
// (interviewing already needed this; the rest silently didn't, so
// Number({...}) => NaN => 0 for any object-shaped field).
const getStageCount = (val) => {
  if (val === null || val === undefined) return 0;
  if (typeof val === "number") return val;
  if (typeof val === "object") return Number(val.total ?? val.value ?? val.count ?? 0) || 0;
  return Number(val) || 0;
};

const stageDefinitions = [
  { terms: ["shortlisted", "shortlist"], key: "shortlisted", label: "shortlisted", get: (data) => getStageCount(data.shortlisted) },
  { terms: ["onboarded", "onboard"], key: "onboarded", label: "onboarded", get: (data) => getStageCount(data.onboarded) },
  { terms: ["matched", "match"], key: "matched", label: "matched", get: (data) => getStageCount(data.matched) },
  { terms: ["interviewing", "interview"], key: "interviewing", label: "interviewing", get: (data) => getStageCount(data.interviewing) },
  { terms: ["selected", "selection"], key: "selected", label: "selected", get: (data) => getStageCount(data.selected) },
  { terms: ["rejected", "rejection"], key: "rejected", label: "rejected", get: (data) => getStageCount(data.rejected) },
];

// ── Small talk — greetings, thanks, sign-offs. Matched separately from the
// product knowledge base since these need live context (user name, current
// page) rather than a fixed answer. ─────────────────────────────────────────
const GREETING_RE = /^(hi+|hello+|hey+|yo|sup|greetings|good\s+(morning|afternoon|evening))\b/i;
const THANKS_RE = /\b(thanks|thank you|thx|appreciate it)\b/i;
const BYE_RE = /^(bye|goodbye|see ya|see you|later|cya)\b/i;
const HOW_ARE_YOU_RE = /\bhow('?s| is| are)?\s*(it going|you doing|you|things)\b/i;

function getResponse(prompt, userName, summary, path) {
  const text = prompt.toLowerCase().trim();
  const stages = summary.candidate_stage_breakdown || {};

  // ── ID-like matches only — require digits, use word boundaries so
  // ordinary words like "clinical" can never be mistaken for "CLIN123" ──
  const candidateIdMatch = prompt.match(/\bCLIN[\s-]?(\d{2,})\b/i);
  const candidateId = candidateIdMatch ? "CLIN" + candidateIdMatch[1] : null;
  const candidateNumMatch = !candidateId && prompt.match(/\bcandidate\s*(?:id)?\s*#?\s*(\d{2,})\b/i);
  const candidateNumId = candidateNumMatch?.[1] || null;

  const requisitionCode = prompt.match(/\b[A-Z]{2,10}-\d{4,}\b/i)?.[0];

  const jobIdMatch = !requisitionCode && prompt.match(/\b(?:job|requisition)\s*(?:id)?\s*#?\s*([a-z0-9-]*\d[a-z0-9-]*)\b/i);
  const jobId = jobIdMatch?.[1] || null;

  const isCreateJobIntent = /\bcreat\w*\b/.test(text) && /\bjob\b/.test(text);
  if (text.includes("start job creation") || isCreateJobIntent) {
    return {
      text: "Opening the Create Job page for you…",
      action: "navigateToCreateJob",
    };
  }

  if (candidateId) return { text: "I will open the Candidates area focused on " + candidateId + ".", label: "Open candidate " + candidateId, path: "/recruit/candidates", state: { candidateId } };
  if (candidateNumId) return { text: "I will open the Candidates area focused on CLIN" + candidateNumId + ".", label: "Open candidate CLIN" + candidateNumId, path: "/recruit/candidates", state: { candidateId: candidateNumId } };
  if (requisitionCode) return { text: "I will find requisition " + requisitionCode.toUpperCase() + " in the Requisitions workspace.", label: "Find " + requisitionCode.toUpperCase(), path: "/recruit/requisitions", state: { requisitionCode } };
  if (jobId) return { text: "I will open job " + jobId + " in its requisition workspace.", label: "Open job " + jobId, path: "/recruit/requisitions/Job-details", state: { job_details_id: jobId, fromCopilot: true } };

  const stage = stageDefinitions.find((item) => item.terms.some((term) => text.includes(term)));
  if (stage) return { text: "There are " + stage.get(stages) + " " + stage.label + " candidates in the current dashboard analytics.", stage: stage.key, stageLabel: "View " + stage.label + " candidates" };

  // ── Small talk ──────────────────────────────────────────────────────────
  if (GREETING_RE.test(text)) {
    return { text: "Hello " + userName + "! You are on " + pageInfo(path).name + ". Ask me anything about how this app works, or say \"Start job creation\" for a guided walkthrough." };
  }
  if (HOW_ARE_YOU_RE.test(text)) {
    return { text: "Doing well, thanks for asking! What can I help you with on " + pageInfo(path).name + "?" };
  }
  if (BYE_RE.test(text)) {
    return { text: "See you around, " + userName + "! I'll be here if you need anything." };
  }
  if (THANKS_RE.test(text)) {
    return { text: "You're welcome! Let me know if there's anything else." };
  }

  // ── Product knowledge base — retrieval over real feature descriptions ──
  const match = retrieveAnswer(prompt, PRODUCT_KNOWLEDGE_BASE);
  if (match) {
    const { entry } = match;
    return entry.action ? { text: entry.answer, ...entry.action } : { text: entry.answer };
  }

  return {
    text: "I didn't catch a specific request there. You can try:\n• \"Start job creation\" — begin the guided wizard\n• \"Show clinical skills\" — preview the skills list\n• \"Show candidate CLIN00785\" — jump to a candidate\n• \"Find CDM-2307261200\" — jump to a requisition code\n• \"What are the different user roles?\" — or ask about any feature here",
  };
}
// ─────────────────────────────────────────────────────────────────────────
// Small reusable step widgets
// ─────────────────────────────────────────────────────────────────────────
const ChipPicker = ({ options, value, onSelect }) => (
  <Stack direction="row" spacing={.7} mt={1} flexWrap="wrap" useFlexGap>
    {options.map((opt) => {
      const optValue = typeof opt === "string" ? opt : opt.value;
      const optLabel = typeof opt === "string" ? opt : opt.label;
      return (
        <Chip key={optValue} label={optLabel} color="primary" variant={value === optValue ? "filled" : "outlined"} onClick={() => onSelect(optValue)} />
      );
    })}
  </Stack>
);

const SkillChips = ({ options, selected, onToggle, loading, allowCustom, onAddCustom }) => {
  const [custom, setCustom] = useState("");
  if (loading) return <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}><CircularProgress size={14} /><Typography fontSize={11.5} color="#52637F">Loading options…</Typography></Box>;
  return (
    <Box mt={1}>
      <Stack direction="row" spacing={.7} flexWrap="wrap" useFlexGap>
        {options.map((opt) => (
          <Chip key={opt.key} label={opt.label || opt.lable} color="primary" variant={selected.includes(opt.key) ? "filled" : "outlined"} onClick={() => onToggle(opt.key)} />
        ))}
        {!options.length && <Typography fontSize={11.5} color="#8B97AC">No options returned for this selection.</Typography>}
      </Stack>
      {allowCustom && (
        <Stack direction="row" spacing={1} mt={1}>
          <TextField size="small" placeholder="Add a custom skill" value={custom} onChange={(e) => setCustom(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && custom.trim()) { onAddCustom(custom.trim()); setCustom(""); } }} />
          <Button size="small" disabled={!custom.trim()} onClick={() => { onAddCustom(custom.trim()); setCustom(""); }}>Add</Button>
        </Stack>
      )}
    </Box>
  );
};


const MATCHING_STEPS = ["Analyzing job requirements…", "Scanning the candidate pool…", "Scoring skill matches…", "Ranking top candidates…"];

const MatchingCandidatesLoader = () => {
  const [stepIndex, setStepIndex] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setStepIndex((i) => (i + 1) % MATCHING_STEPS.length), 1100);
    return () => clearInterval(t);
  }, []);
  return (
    <Paper elevation={0} sx={{ p: 1.5, borderRadius: 2.5, border: "1px solid #E7ECF7", bgcolor: "#F7F9FF" }}>
      <Stack direction="row" spacing={1.2} alignItems="center">
        <Box sx={{
          width: 26, height: 26, borderRadius: "50%", flexShrink: 0,
          display: "grid", placeItems: "center", bgcolor: "#244DCD",
          animation: "matchPulse 1.1s ease-in-out infinite",
          "@keyframes matchPulse": { "0%,100%": { transform: "scale(1)", opacity: 1 }, "50%": { transform: "scale(.82)", opacity: .7 } },
        }}>
          <AutoAwesomeRoundedIcon sx={{ fontSize: 14, color: "#fff" }} />
        </Box>
        <Typography fontSize={12.5} fontWeight={700} color="#1E315C" sx={{ transition: "opacity .2s" }}>
          {MATCHING_STEPS[stepIndex]}
        </Typography>
      </Stack>
      <Stack spacing={.8} mt={1.2}>
        {[0, 1, 2].map((i) => (
          <Box key={i} sx={{
            height: 46, borderRadius: 2, bgcolor: "#EEF2FF",
            backgroundImage: "linear-gradient(90deg, #EEF2FF 0%, #DCE5FA 50%, #EEF2FF 100%)",
            backgroundSize: "200% 100%",
            animation: "matchShimmer 1.4s ease-in-out infinite",
            animationDelay: `${i * 0.15}s`,
            "@keyframes matchShimmer": { "0%": { backgroundPosition: "200% 0" }, "100%": { backgroundPosition: "-200% 0" } },
          }} />
        ))}
      </Stack>
    </Paper>
  );
};


function DashboardAiAssistant({ summary = {}, navigate, userName, onViewStage, forceOpen, onClose, contextPath = "" }) {
  const [open, setOpen] = useState(Boolean(forceOpen));

  // ── Draggable bubble: position tracked as distance from the right/bottom
  // viewport edges (not left/top) so the chat panel keeps growing up-and-left
  // from the bubble correctly no matter where it's been dragged to. ────────
  const BUBBLE_SIZE = 52;
  const [bubblePos, setBubblePos] = useState({ right: 28, bottom: 24 });
  const dragRef = useRef({ dragging: false, moved: false, startX: 0, startY: 0, startRight: 0, startBottom: 0 });

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const handleBubblePointerDown = (event) => {
    dragRef.current = {
      dragging: true,
      moved: false,
      startX: event.clientX,
      startY: event.clientY,
      startRight: bubblePos.right,
      startBottom: bubblePos.bottom,
    };
    window.addEventListener("pointermove", handleBubblePointerMove);
    window.addEventListener("pointerup", handleBubblePointerUp);
  };

  const handleBubblePointerMove = (event) => {
    const drag = dragRef.current;
    if (!drag.dragging) return;
    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) drag.moved = true;
    setBubblePos({
      right: clamp(drag.startRight - dx, 8, window.innerWidth - BUBBLE_SIZE - 8),
      bottom: clamp(drag.startBottom - dy, 8, window.innerHeight - BUBBLE_SIZE - 8),
    });
  };

  const handleBubblePointerUp = () => {
    dragRef.current.dragging = false;
    window.removeEventListener("pointermove", handleBubblePointerMove);
    window.removeEventListener("pointerup", handleBubblePointerUp);
  };

  const handleBubbleClick = () => {
    if (dragRef.current.moved) return;
    setOpen((value) => !value);
  };

  useEffect(() => () => {
    window.removeEventListener("pointermove", handleBubblePointerMove);
    window.removeEventListener("pointerup", handleBubblePointerUp);
  }, []);

  const [input, setInput] = useState("");
  const [stageAction, setStageAction] = useState(null);

  const [jobStep, setJobStep] = useState(null); // null = wizard not started
  const [draft, setDraft] = useState(emptyDraft);
  const [fileError, setFileError] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [questionsData, setQuestionsData] = useState([]);
  const [subFunctionMap, setSubFunctionMap] = useState({});
  const [secondarySkills, setSecondarySkills] = useState([]); // mutation result, non-CP
  const [cpSecondarySkills, setCpSecondarySkills] = useState([]); // mutation result, CP
  const [matchingLoading, setMatchingLoading] = useState(false);
  const info = pageInfo(contextPath);
  const isCreateJob = contextPath.includes("/create-job");
  const isCDM = draft.functionLabel === "Clinical Data Management";
  const isCPSub = draft.subFunctionLabel === "Clinical Programmer/CRF Developer";
  const primaryCsv = draft.primarySkills.join(",");
  const mandatoryCsv = draft.mandatorySkills.join(",");


  const { data: countriesData } = useGetCountriesQuery(undefined, { skip: !reached(jobStep, STEP.COUNTRY) });
  const { data: locationsData } = useGetLocationsByCountryQuery(draft.country, { skip: !reached(jobStep, STEP.CITY) || !draft.country });
  const { data: subFunctionsData } = useGetClinicalSubFunctionsQuery(draft.functionKey, { skip: !reached(jobStep, STEP.SUBFUNCTION) || !draft.functionKey });

  const countries = countriesData || [];
  const cityOptions = locationsData || [];

  const { data: normalSkillsData, isFetching: loadingNormal } = useGetNormalSkillsQuery(
    { subFunctionKey: draft.subFunctionKey, mode: "normal" },
    { skip: !reached(jobStep, STEP.NORMAL_SKILLS) || !draft.subFunctionKey }
  );
  const normalSkillOptions = normalSkillsData?.data || [];

  const primarySkillsEndpoint = draft.functionLabel === "Bio Statistics" ? "statistical programmer" : draft.functionLabel === "Clinical Data Management" ? "clinical data manager" : null;
  const { data: primarySkillsData, isFetching: loadingPrimary } = useGetPrimarySkillsQuery(primarySkillsEndpoint, { skip: !reached(jobStep, STEP.PRIMARY_SKILLS) || !primarySkillsEndpoint });
  const primarySkillOptions = primarySkillsData || [];

  const { data: mandatorySkillsData, isFetching: loadingMandatory } = useGetMandatorySkillsQuery(
    { subFunctionKey: draft.subFunctionKey, primaryCsv: isCDM ? "" : primaryCsv },
    { skip: !reached(jobStep, STEP.MANDATORY_SKILLS) || !draft.subFunctionKey || isCPSub }
  );
  const mandatorySkillOptions = mandatorySkillsData?.data || [];

  const { data: raveSkillsData, isFetching: loadingRave } = useGetRaveProgrammerSkillsQuery(undefined, { skip: !reached(jobStep, STEP.MANDATORY_SKILLS) || !isCPSub });
  const cpMandatoryOptions = raveSkillsData?.data || [];

  const { data: edcToolsData } = useGetEdcToolsQuery(undefined, { skip: !reached(jobStep, STEP.EDC_TOOLS) });
  const edcOptions = edcToolsData?.data || [];

  const { data: therapeuticData } = useGetTherapeuticAreasQuery(undefined, { skip: !reached(jobStep, STEP.THERAPEUTIC) });
  const therapeuticOptions = therapeuticData?.success ? therapeuticData.data : [];

  const { data: superAdmins } = useGetUsersByRoleQuery("super_admin", { skip: !reached(jobStep, STEP.APPROVER) });
  const { data: admins } = useGetUsersByRoleQuery("admin", { skip: !reached(jobStep, STEP.APPROVER) });
  const { data: hmUsers } = useGetUsersByRoleQuery("hm_user", { skip: !reached(jobStep, STEP.APPROVER) });
  const peopleList = useMemo(() => {
    const all = [...(superAdmins?.data || []), ...(admins?.data || []), ...(hmUsers?.data || [])];
    const map = new Map();
    all.forEach((u) => { if (u.id && u.name) map.set(u.id, { id: u.id, name: u.name, designation: u.designation }); });
    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [superAdmins, admins, hmUsers]);

  const [getSecondarySkills, { isLoading: loadingSecondary }] = useGetSecondarySkillsMutation();
  const [getRaveSecondary, { isLoading: loadingCpSecondary }] = useGetRaveProgrammerSecondarySkillsMutation();
  const [createJob, { isLoading: submitting }] = useCreateJobMutation();
  const [fetchClinicalSkills, { isFetching: loadingClinicalSkills }] = useLazyGetPrimarySkillsQuery();
  const [fetchMatchingCandidates] = useLazyGetMatchingCandidatesQuery();
  const displayName = userName?.trim() || "there";
  const overview = summary.job_overview || {};
  const totalJobs = overview.total_jobs?.value ?? overview.total_jobs?.total ?? 0;
  const openJobs = overview.open_jobs?.value ?? overview.open_jobs?.total ?? 0;

  const welcome = useMemo(() => {
    if (isCreateJob) return "Hi " + displayName + ". I can guide you through creating a job right here in chat...";
    return "Hi " + displayName + ". You are on " + info.name + ". Analytics show " + totalJobs + " total jobs and " + openJobs + " open jobs. Ask a question about this page.";
  }, [displayName, info.name, isCreateJob, totalJobs, openJobs]);

  const [messages, setMessages] = useState([{ text: welcome, from: "ai" }]);

  useEffect(() => { if (typeof forceOpen === "boolean") setOpen(forceOpen); }, [forceOpen]);
  useEffect(() => { setMessages((current) => current.length === 1 ? [{ from: "ai", text: welcome }] : current); }, [welcome]);

  // ── Auto-scroll the chat body to the bottom whenever new content lands ──
  const chatBodyRef = useRef(null);
  useEffect(() => {
    const el = chatBodyRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, jobStep, stageAction, matchingLoading, open]);

  // ── Sync sub-function data (label -> raw sub_function key map) ──────────
  useEffect(() => {
    if (!subFunctionsData) return;
    const map = {};
    subFunctionsData.forEach((item) => { map[item.label || item.lable] = item.sub_function; });
    setSubFunctionMap(map);
  }, [subFunctionsData]);

  const startJobWizard = () => {
    setMessages((current) =>
      current.filter(msg => !msg.createJobChoice)
    );

    setDraft(emptyDraft);
    setSecondarySkills([]);
    setCpSecondarySkills([]);
    setFileError("");
    setJobStep(STEP.DOMAIN);
  };
  const updateDraft = (patch) => setDraft((current) => ({ ...current, ...patch }));

  const advance = (patch) => {
    const merged = { ...draft, ...patch };
    setDraft(merged);
    setJobStep(nextStep(jobStep, merged));
  };

  const loadSecondarySkills = async () => {
    try {
      if (isCPSub) {
        const res = await getRaveSecondary(draft.cpmSkills).unwrap();
        setCpSecondarySkills(res?.data || []);
      } else {
        const res = await getSecondarySkills({ subFunctionKey: draft.subFunctionKey, primaryCsv: isCDM ? "" : primaryCsv, mandatoryCsv }).unwrap();
        setSecondarySkills(res?.data || []);
      }
    } catch (error) {
      setSecondarySkills([]);
      setCpSecondarySkills([]);
    }
  };

  const toggleInArray = (field) => (key) => {
    setDraft((current) => ({
      ...current,
      [field]: current[field].includes(key) ? current[field].filter((item) => item !== key) : [...current[field], key],
    }));
  };
  const addCustomInArray = (field) => (value) => {
    const key = value.trim().toLowerCase().replace(/\s+/g, "_");
    setDraft((current) => (current[field].includes(key) ? current : { ...current, [field]: [...current[field], key] }));
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;
    const validTypes = ["application/pdf", "text/plain", "application/msword", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (validTypes.includes(selectedFile.type)) { updateDraft({ file: selectedFile, instructions: "" }); setFileError(""); }
    else { setFileError("Please upload a valid file (PDF, TXT, DOC, DOCX, XLSX)."); updateDraft({ file: null }); }
  };

  // ── Build FormData exactly like buildCommonFormData + handleSubmitClinical/NonClinical ──
  const buildCommonFormData = (fd) => {
    fd.append("no_of_positions", draft.noOfPositions || "");
    fd.append("designation", draft.designation.trim());
    fd.append("min_years", draft.min ?? "0");
    fd.append("max_years", draft.max || "");
    fd.append("priority", draft.priority);
    fd.append("country", draft.country || "");
    fd.append("city", draft.city || "");
    fd.append("job_type", draft.jobType || "");
    fd.append("mode_of_work", draft.modeOfWork || "");
    fd.append("salary_range", draft.salaryRange || "");
    fd.append("salary_unit", draft.salaryUnit || "");
    fd.append("job_approver", draft.selectedManager?.id || "");
    fd.append("recruiter", draft.selectedRecruiters.map((r) => r.id).join(","));
    if (draft.availability?.value !== null && draft.availability?.value !== "") fd.append("availability", draft.availability.value);
    if (draft.closingDate) fd.append("closing_date", format(draft.closingDate, "yyyy-MM-dd"));
    if (draft.file) fd.append("file", draft.file);
    else if (draft.instructions.trim()) fd.append("text", draft.instructions.trim());
    fd.append("save_as_template", false);
  };

  const submitJob = async () => {
    const fd = new FormData();
    const isClinical = draft.domain === "clinical";
    if (isClinical) {
      fd.append("domain", "clinical");
      fd.append("function", draft.functionKey);
      fd.append("sub_function", draft.subFunctionKey === "clinical programmer" ? "clinical programmer/crf developer" : draft.subFunctionKey);
      fd.append("mode", draft.skillMode);
      if (draft.skillMode === "normal") {
        fd.append("normal_skills", draft.normalSkills.join(","));
        fd.append("primaryskills", ""); fd.append("mandatoryskills", ""); fd.append("secondaryskills", "");
      } else {
        fd.append("normal_skills", "");
        fd.append("primaryskills", draft.primarySkills.join(","));
        fd.append("mandatoryskills", isCPSub ? draft.cpmSkills.join(",") : draft.mandatorySkills.join(","));
        fd.append("secondaryskills", isCPSub ? draft.cpsSkills.join(",") : draft.secondarySkills.join(","));
      }
      fd.append("edc", draft.edcTools.join(","));
      fd.append("therapeutic_experience", draft.therapeuticExperience.join(","));
    } else {
      fd.append("domain", draft.domain);
      fd.append("function", "generic");
      fd.append("sub_function", "generic");
      fd.append("mode", "normal");
      fd.append("domainskills", draft.domainSkills.join(","));
    }
    buildCommonFormData(fd);
    try {
      const response = await createJob(fd).unwrap();
      const newJobId = response?.data?.job_details_id;

      if (response?.data && newJobId) {
        setMessages((current) => [...current, { from: "ai", text: `Job created successfully (ID ${newJobId}). Looking for matching candidates…` }]);
        setJobStep(null);
        setMatchingLoading(true);
        try {
          const rawResult = await fetchMatchingCandidates(newJobId).unwrap();
          // The API tucks a non-candidate summary object into the same array
          // (e.g. { count: {...} }) — filter to real candidate records only.
          const candidates = (rawResult || []).filter((c) => c.candidate_name);
          setMessages((current) => [...current, candidates.length
            ? {
              from: "ai",
              text: `Found ${candidates.length} matching candidate${candidates.length === 1 ? "" : "s"} for this role. Tap a candidate to view their profile:`,
              matchedCandidates: candidates,
            }
            : {
              from: "ai",
              text: "No matching candidates were found yet for this role.",
              label: "View requisition",
              path: "/recruit/requisitions/Job-details",
              state: { job_details_id: newJobId },
            }]);
        } catch (matchError) {
          setMessages((current) => [...current, {
            from: "ai",
            text: "The job was created, but I couldn't fetch matched candidates just now.",
            label: "View requisition",
            path: "/recruit/requisitions/Job-details",
            state: { job_details_id: newJobId },
          }]);
        } finally {
          setMatchingLoading(false);
        }
      } else {
        setMessages((current) => [...current, { from: "ai", text: "The submission did not return the expected data. Please try again." }]);
      }
    } catch (error) {
      setMessages((current) => [...current, { from: "ai", text: error?.data?.message || "Something went wrong creating the job. Please try again." }]);
    }
  };

  const close = () => { setOpen(false); onClose?.(); };

  const clearChat = () => {
    setMessages([{ from: "ai", text: welcome }]);
    setStageAction(null);
    setInput("");
    setJobStep(null);
    setDraft(emptyDraft);
    setSecondarySkills([]);
    setCpSecondarySkills([]);
    setFileError("");
  };

  const showClinicalSkills = async () => {
    try {
      const data = await fetchClinicalSkills("clinical data manager").unwrap();
      const skills = data || [];
      setMessages((current) => [...current, skills.length
        ? { from: "ai", text: "Here are the clinical skills from the Create Job skills API:", skills }
        : { from: "ai", text: "The clinical skills API returned no results." }]);
    } catch (error) {
      setMessages((current) => [...current, { from: "ai", text: "I couldn't reach the clinical skills API just now. Please try again." }]);
    }
  };

  const showStudyPhaseSkills = (phaseKey) => {
    const phase = STUDY_PHASE_SKILLS[phaseKey];
    if (!phase) return;
    setMessages((current) => [...current, {
      from: "ai",
      text: phase.label + ": " + phase.summary,
      skills: phase.skills,
    }]);
  };


  const ask = (value = input) => {
    const clean = value.trim();
    if (!clean) return;
    setMessages((current) => [...current, { from: "user", text: clean }]);
    setInput("");
    const lower = clean.toLowerCase();
    if (/clinical skill/i.test(clean)) { showClinicalSkills(); return; }
    const phase = detectStudyPhase(lower);
    if (phase) { showStudyPhaseSkills(phase); return; }
    const response = getResponse(clean, displayName, summary, contextPath);
    if (response.action === "navigateToCreateJob") { goToCreateJob(); return; }
    setMessages((current) => [...current, { from: "ai", ...response }]);
    setStageAction(response.stage ? response : null);
  };

  const goToCreateJob = () => {
    navigate("/recruit/create-job/job-requirements");
    close(); // close the AI assistant
  };
  // ── Step field titles ────────────────────────────────────────────────
  const stepTitle = {
    [STEP.DOMAIN]: "Select domain",
    [STEP.POSITIONS]: "No. of positions",
    [STEP.FUNCTION]: "Function",
    [STEP.SUBFUNCTION]: "Sub function",
    [STEP.TITLE]: "Job title",
    [STEP.MIN_EXP]: "Minimum experience (years)",
    [STEP.MAX_EXP]: "Maximum experience (years)",
    [STEP.AVAILABILITY]: "Candidate availability",
    [STEP.COUNTRY]: "Country",
    [STEP.CITY]: "City",
    [STEP.SKILL_MODE]: "Skill mode",
    [STEP.NORMAL_SKILLS]: "Skills",
    [STEP.PRIMARY_SKILLS]: "Primary skills",
    [STEP.MANDATORY_SKILLS]: "Mandatory skills",
    [STEP.SECONDARY_SKILLS]: "Secondary skills",
    [STEP.EDC_TOOLS]: "EDC tools",
    [STEP.THERAPEUTIC]: "Therapeutic experience",
    [STEP.DOMAIN_SKILLS]: "Skills",
    [STEP.JOB_TYPE]: "Job type",
    [STEP.MODE_OF_WORK]: "Mode of work",
    [STEP.PRIORITY]: "Priority",
    [STEP.CLOSING_DATE]: "Closing date",
    [STEP.SALARY]: "Salary (optional)",
    [STEP.APPROVER]: "Approver",
    [STEP.RECRUITERS]: "TA team (optional)",
    [STEP.INSTRUCTIONS]: "Additional instructions or file (optional)",
    [STEP.REVIEW]: "Review & submit",
  }[jobStep];

  const STUDY_PHASE_SKILLS = {
    "study startup": {
      label: "Study Startup",
      summary: "Getting the trial's data infrastructure ready before the first patient is enrolled.",
      skills: [
        { key: "crf_design", label: "CRF Design & Annotation" },
        { key: "database_build", label: "EDC Database Build (Rave / Veeva / InForm)" },
        { key: "edit_checks", label: "Edit Check Specification & Programming" },
        { key: "dmp", label: "Data Management Plan (DMP) Authoring" },
        { key: "coding_dictionaries", label: "MedDRA / WHODrug Dictionary Setup" },
        { key: "uat", label: "eCRF User Acceptance Testing (UAT)" },
        { key: "crf_guidelines", label: "CRF Completion Guidelines" },
      ],
    },
    "study conduct": {
      label: "Study Conduct",
      summary: "Ongoing data collection and cleaning while the trial is actively enrolling and dosing patients.",
      skills: [
        { key: "query_management", label: "Query Management & Resolution" },
        { key: "data_review", label: "Data Review & Cleaning" },
        { key: "sae_reconciliation", label: "SAE Reconciliation" },
        { key: "medical_coding", label: "MedDRA / WHODrug Coding" },
        { key: "third_party_recon", label: "Third-Party Data Reconciliation (Labs, ECG, IRT)" },
        { key: "protocol_deviations", label: "Protocol Deviation Tracking" },
        { key: "interim_lock", label: "Interim Database Lock Support" },
      ],
    },
    "study closeout": {
      label: "Study Closeout",
      summary: "Final data cleaning, lock, and handoff once the last patient has completed the study.",
      skills: [
        { key: "database_lock", label: "Soft / Hard Database Lock Procedures" },
        { key: "final_discrepancy", label: "Final Discrepancy Resolution" },
        { key: "sae_final_recon", label: "Final SAE Reconciliation" },
        { key: "sdtm_extraction", label: "SDTM Data Extraction & Transfer" },
        { key: "archival", label: "Study Documentation Archival" },
        { key: "lock_readiness", label: "Lock Readiness Checklist" },
        { key: "csr_support", label: "CSR Data Support" },
      ],
    },
  };

  const detectStudyPhase = (text) => {
    if (text.includes("study startup") || /\bstart\s*up\b/.test(text)) return "study startup";
    if (text.includes("study conduct") || /\bconduct\b/.test(text)) return "study conduct";
    if (text.includes("study closeout") || text.includes("close out") || text.includes("closeout")) return "study closeout";
    return null;
  };



  const canSubmit = draft.domain && draft.designation.trim() && draft.min !== "" && draft.max !== "" && Number(draft.max) >= Number(draft.min) && draft.availability && draft.selectedManager && !submitting;
  const jobWizard = jobStep && (
    <Paper elevation={0} sx={{ p: 1.5, borderRadius: 3, border: "1px solid #C9D7FF", bgcolor: "#F7F9FF" }}>
      <Typography>CREATE JOB · {jobStep === STEP.REVIEW ? "REVIEW" : "IN PROGRESS"}</Typography>
      <Typography>{stepTitle}</Typography>
      {jobStep === STEP.DOMAIN && (
        <ChipPicker options={DOMAINS} value={draft.domain} onSelect={(v) => advance({ domain: v })} />
      )}

      {jobStep === STEP.POSITIONS && (
        <ChipPicker options={["One", "Two", "More than Two"]} value={draft.noOfPositions} onSelect={(v) => advance({ noOfPositions: v })} />
      )}

      {jobStep === STEP.FUNCTION && (
        <ChipPicker
          options={FUNCTIONS.map((f) => ({ value: f.label, label: f.label }))}
          value={draft.functionLabel}
          onSelect={(label) => {
            const f = FUNCTIONS.find((item) => item.label === label);
            advance({ functionLabel: label, functionKey: f.key, subFunctionLabel: "", subFunctionKey: "" });
          }}
        />
      )}

      {jobStep === STEP.SUBFUNCTION && (
        <>
          {!subFunctionsData ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}><CircularProgress size={14} /><Typography fontSize={11.5} color="#52637F">Loading sub functions…</Typography></Box>
          ) : (
            <ChipPicker
              options={Object.keys(subFunctionMap)}
              value={draft.subFunctionLabel}
              onSelect={(label) => {
                const key = subFunctionMap[label] || "";
                advance({ subFunctionLabel: label, subFunctionKey: key, designation: draft.designation || generateJobTitle(label) });
              }}
            />
          )}
        </>
      )}

      {jobStep === STEP.TITLE && (
        <Stack direction="row" spacing={1} mt={1}>
          <TextField autoFocus fullWidth size="small" value={draft.designation} onChange={(e) => updateDraft({ designation: e.target.value })} placeholder="e.g. CDM-2307261200" />
          <Button variant="contained" disabled={!draft.designation.trim()} onClick={() => advance({})}>Next</Button>
        </Stack>
      )}

      {jobStep === STEP.MIN_EXP && (
        <Stack direction="row" spacing={1} mt={1}>
          <TextField autoFocus fullWidth size="small" type="number" inputProps={{ min: 0 }} value={draft.min} onChange={(e) => updateDraft({ min: e.target.value })} />
          <Button variant="contained" disabled={draft.min === ""} onClick={() => advance({})}>Next</Button>
        </Stack>
      )}

      {jobStep === STEP.MAX_EXP && (
        <Stack direction="row" spacing={1} mt={1}>
          <TextField autoFocus fullWidth size="small" type="number" inputProps={{ min: draft.min || 0 }} value={draft.max} onChange={(e) => updateDraft({ max: e.target.value })} error={draft.max !== "" && Number(draft.max) < Number(draft.min)} />
          <Button variant="contained" disabled={draft.max === "" || Number(draft.max) < Number(draft.min)} onClick={() => advance({})}>Next</Button>
        </Stack>
      )}

      {jobStep === STEP.AVAILABILITY && (
        <ChipPicker options={availabilityOptions} value={draft.availability?.value} onSelect={(v) => advance({ availability: availabilityOptions.find((o) => o.value === v) })} />
      )}

      {jobStep === STEP.COUNTRY && (
        <Stack mt={1}>
          <Autocomplete freeSolo size="small" options={countries} value={draft.country} onChange={(_e, v) => updateDraft({ country: v || "", city: "" })} onInputChange={(_e, v) => updateDraft({ country: v })} renderInput={(params) => <TextField {...params} label="Country" size="small" />} />
          <Button sx={{ mt: 1, alignSelf: "flex-start", textTransform: "none" }} disabled={!draft.country} onClick={() => advance({})}>Next</Button>
        </Stack>
      )}

      {jobStep === STEP.CITY && (
        <Stack mt={1}>
          <Autocomplete freeSolo size="small" options={cityOptions} value={draft.city} onChange={(_e, v) => updateDraft({ city: v || "" })} onInputChange={(_e, v) => updateDraft({ city: v })} renderInput={(params) => <TextField {...params} label="City" size="small" />} />
          <Button sx={{ mt: 1, alignSelf: "flex-start", textTransform: "none" }} disabled={!draft.city} onClick={() => advance({})}>Next</Button>
        </Stack>
      )}

      {jobStep === STEP.SKILL_MODE && (
        <ChipPicker options={[{ value: "normal", label: "Standard" }, { value: "advanced", label: "Advanced" }]} value={draft.skillMode} onSelect={(v) => advance({ skillMode: v, normalSkills: [], primarySkills: [], mandatorySkills: [], secondarySkills: [], cpmSkills: [], cpsSkills: [] })} />
      )}

      {jobStep === STEP.NORMAL_SKILLS && (
        <>
          <SkillChips options={normalSkillOptions} selected={draft.normalSkills} onToggle={toggleInArray("normalSkills")} loading={loadingNormal} allowCustom onAddCustom={addCustomInArray("normalSkills")} />
          <Button sx={{ mt: 1, textTransform: "none" }} disabled={!draft.normalSkills.length} onClick={() => advance({})}>Continue</Button>
        </>
      )}

      {jobStep === STEP.PRIMARY_SKILLS && (
        <>
          <SkillChips options={primarySkillOptions} selected={draft.primarySkills} onToggle={toggleInArray("primarySkills")} loading={loadingPrimary} allowCustom onAddCustom={addCustomInArray("primarySkills")} />
          <Button sx={{ mt: 1, textTransform: "none" }} disabled={!draft.primarySkills.length} onClick={() => advance({})}>Continue</Button>
        </>
      )}

      {jobStep === STEP.MANDATORY_SKILLS && (
        <>
          <SkillChips
            options={isCPSub ? cpMandatoryOptions : mandatorySkillOptions}
            selected={isCPSub ? draft.cpmSkills : draft.mandatorySkills}
            onToggle={toggleInArray(isCPSub ? "cpmSkills" : "mandatorySkills")}
            loading={isCPSub ? loadingRave : loadingMandatory}
          />
          <Button
            sx={{ mt: 1, textTransform: "none" }}
            disabled={isCPSub ? !draft.cpmSkills.length : !draft.mandatorySkills.length}
            onClick={() => { setJobStep(nextStep(jobStep, draft)); loadSecondarySkills(); }}
          >
            Continue
          </Button>
        </>
      )}

      {jobStep === STEP.SECONDARY_SKILLS && (
        <>
          <SkillChips
            options={isCPSub ? cpSecondarySkills : secondarySkills}
            selected={isCPSub ? draft.cpsSkills : draft.secondarySkills}
            onToggle={toggleInArray(isCPSub ? "cpsSkills" : "secondarySkills")}
            loading={isCPSub ? loadingCpSecondary : loadingSecondary}
          />
          <Button sx={{ mt: 1, textTransform: "none" }} onClick={() => advance({})}>Continue</Button>
        </>
      )}

      {jobStep === STEP.EDC_TOOLS && (
        <>
          <SkillChips options={edcOptions.map((t) => ({ key: t.key, label: t.lable }))} selected={draft.edcTools} onToggle={toggleInArray("edcTools")} />
          <Button sx={{ mt: 1, textTransform: "none" }} disabled={!draft.edcTools.length} onClick={() => advance({})}>Continue</Button>
        </>
      )}

      {jobStep === STEP.THERAPEUTIC && (
        <>
          <Stack direction="row" spacing={.7} mt={1} flexWrap="wrap" useFlexGap>
            <Chip
              label={draft.therapeuticExperience.length === therapeuticOptions.length ? "Clear all" : "Select all"}
              onClick={() => updateDraft({ therapeuticExperience: draft.therapeuticExperience.length === therapeuticOptions.length ? [] : therapeuticOptions.map((a) => a.lable) })}
              sx={{ fontWeight: 700 }}
            />
            {therapeuticOptions.map((area) => (
              <Chip key={area.lable} label={area.lable} color="primary" variant={draft.therapeuticExperience.includes(area.lable) ? "filled" : "outlined"} onClick={() => toggleInArray("therapeuticExperience")(area.lable)} />
            ))}
          </Stack>
          <Button sx={{ mt: 1, textTransform: "none" }} onClick={() => advance({})}>Continue</Button>
        </>
      )}

      {jobStep === STEP.DOMAIN_SKILLS && (
        <>
          <SkillChips options={DOMAIN_SKILLS[draft.domain] || []} selected={draft.domainSkills} onToggle={toggleInArray("domainSkills")} allowCustom onAddCustom={addCustomInArray("domainSkills")} />
          <Button sx={{ mt: 1, textTransform: "none" }} disabled={!draft.domainSkills.length} onClick={() => advance({})}>Continue</Button>
        </>
      )}

      {jobStep === STEP.JOB_TYPE && <ChipPicker options={jobTypeOptions} value={draft.jobType} onSelect={(v) => advance({ jobType: v })} />}
      {jobStep === STEP.MODE_OF_WORK && <ChipPicker options={modeOfWorkOptions} value={draft.modeOfWork} onSelect={(v) => advance({ modeOfWork: v })} />}
      {jobStep === STEP.PRIORITY && <ChipPicker options={priorityOptions} value={draft.priority} onSelect={(v) => advance({ priority: v })} />}

      {jobStep === STEP.CLOSING_DATE && (
        <Stack direction="row" spacing={1} mt={1}>
          <TextField type="date" size="small" fullWidth value={draft.closingDate ? format(draft.closingDate, "yyyy-MM-dd") : ""} onChange={(e) => updateDraft({ closingDate: e.target.value ? new Date(e.target.value) : null })} />
          <Button variant="contained" disabled={!draft.closingDate} onClick={() => advance({})}>Next</Button>
        </Stack>
      )}

      {jobStep === STEP.SALARY && (
        <Stack spacing={1} mt={1}>
          <TextField select size="small" label="Salary unit" SelectProps={{ native: true }} value={draft.salaryUnit} onChange={(e) => updateDraft({ salaryUnit: e.target.value })}>
            <option value="">Not specified</option>
            {draft.country?.toLowerCase() === "india" ? <option value="INR / Per Annum">INR / Per Annum</option> : ["USD / Per Hour", "USD / Per Month", "USD / Per Annum"].map((u) => <option key={u} value={u}>{u}</option>)}
          </TextField>
          <TextField size="small" label="Salary" value={draft.salaryRange} onChange={(e) => updateDraft({ salaryRange: e.target.value })} />
          <Button sx={{ alignSelf: "flex-start", textTransform: "none" }} onClick={() => advance({})}>Continue</Button>
        </Stack>
      )}

      {jobStep === STEP.APPROVER && (
        <Stack mt={1}>
          <Autocomplete
            size="small" options={peopleList}
            getOptionLabel={(o) => `${o?.name || ""}${o?.designation ? ` (${o.designation})` : ""}`}
            value={draft.selectedManager}
            onChange={(_e, v) => updateDraft({ selectedManager: v })}
            renderInput={(params) => <TextField {...params} label="Approver" size="small" />}
          />
          <Button sx={{ mt: 1, alignSelf: "flex-start", textTransform: "none" }} disabled={!draft.selectedManager} onClick={() => advance({})}>Next</Button>
        </Stack>
      )}

      {jobStep === STEP.RECRUITERS && (
        <Stack mt={1}>
          <Autocomplete
            multiple size="small"
            options={peopleList.filter((u) => u.id !== draft.selectedManager?.id)}
            getOptionLabel={(o) => o?.name || ""}
            value={draft.selectedRecruiters}
            onChange={(_e, v) => updateDraft({ selectedRecruiters: v })}
            renderInput={(params) => <TextField {...params} label="TA team" size="small" />}
          />
          <Button sx={{ mt: 1, alignSelf: "flex-start", textTransform: "none" }} onClick={() => advance({})}>Continue</Button>
        </Stack>
      )}

      {jobStep === STEP.INSTRUCTIONS && (
        <Stack mt={1} spacing={1}>
          <TextField fullWidth multiline rows={3} size="small" label="Instructions (skip if uploading a file)" value={draft.instructions} disabled={!!draft.file} onChange={(e) => updateDraft({ instructions: e.target.value })} />
          <Typography fontSize={11} color="#8B97AC" textAlign="center">— or —</Typography>
          {!draft.file ? (
            <Button variant="outlined" component="label" sx={{ textTransform: "none" }}>
              Upload file
              <input type="file" hidden onChange={handleFileChange} accept=".pdf,.txt,.doc,.docx,.xls,.xlsx" />
            </Button>
          ) : (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography fontSize={12}>Selected file: {draft.file.name}</Typography>
              <IconButton size="small" onClick={() => updateDraft({ file: null })} sx={{ ml: 1, color: "error.main" }}><CloseIcon fontSize="inherit" /></IconButton>
            </Box>
          )}
          {fileError && <Typography fontSize={11} color="error">{fileError}</Typography>}
          <Button sx={{ textTransform: "none" }} onClick={() => advance({})}>Continue to review</Button>
        </Stack>
      )}

      {jobStep === STEP.REVIEW && (
        <Stack mt={1} spacing={.5}>
          <Typography fontSize={12}>Domain: <b>{draft.domain}</b> · Positions: <b>{draft.noOfPositions}</b></Typography>
          {draft.domain === "clinical" && <Typography fontSize={12}>Function: <b>{draft.functionLabel}</b> · Sub function: <b>{draft.subFunctionLabel}</b></Typography>}
          <Typography fontSize={12}>Title: <b>{draft.designation}</b></Typography>
          <Typography fontSize={12}>Experience: <b>{draft.min}–{draft.max} yrs</b> · Availability: <b>{draft.availability?.label}</b></Typography>
          <Typography fontSize={12}>Location: <b>{draft.city ? `${draft.city}, ` : ""}{draft.country}</b></Typography>
          {draft.domain === "clinical" ? (
            <Typography fontSize={12}>Skills ({draft.skillMode}): <b>
              {draft.skillMode === "normal" ? draft.normalSkills.join(", ") : [...draft.primarySkills, ...(isCPSub ? draft.cpmSkills : draft.mandatorySkills), ...(isCPSub ? draft.cpsSkills : draft.secondarySkills)].join(", ")}
            </b></Typography>
          ) : (
            <Typography fontSize={12}>Skills: <b>{draft.domainSkills.join(", ")}</b></Typography>
          )}
          <Typography fontSize={12}>Job type: <b>{draft.jobType}</b> · Mode: <b>{draft.modeOfWork}</b> · Priority: <b>{draft.priority}</b></Typography>
          <Typography fontSize={12}>Closing date: <b>{draft.closingDate ? format(draft.closingDate, "dd/MM/yyyy") : "—"}</b></Typography>
          <Typography fontSize={12}>Approver: <b>{draft.selectedManager?.name || "—"}</b></Typography>
          <Button variant="contained" sx={{ mt: 1, textTransform: "none", fontWeight: 800 }} disabled={!canSubmit} onClick={submitJob}>
            {submitting ? <CircularProgress size={16} sx={{ color: "white" }} /> : "Submit job"}
          </Button>
        </Stack>
      )}
    </Paper>
  );

  return (
    <Box sx={{ position: "fixed", right: bubblePos.right, bottom: bubblePos.bottom, zIndex: (theme) => theme.zIndex.modal - 1 }}>
      {open &&
        <Paper elevation={0} sx={{ width: { xs: "calc(100vw - 32px)", sm: 400 }, height: { xs: "calc(100vh - 140px)", sm: 400, md: 400, lg: 500, xxl: 700 }, mb: 1.5, borderRadius: 5, overflow: "hidden", border: "1px solid #DCE5FA", boxShadow: "0 24px 70px rgba(24,57,141,.25)", display: "flex", flexDirection: "column", bgcolor: "#fff" }}>
          <Box sx={{ px: 2, py: 1.5, display: "flex", alignItems: "center", gap: 1.2, color: "white", background: "linear-gradient(120deg,#143FBD,#5B3FC5)" }}>
            <Box sx={{ width: 36, height: 36, borderRadius: 2.5, display: "grid", placeItems: "center", bgcolor: "rgba(255,255,255,.17)" }}><AutoAwesomeRoundedIcon fontSize="small" /></Box>
            <Box sx={{ flex: 1 }}><Typography fontWeight={800} fontSize={14}>Ri8 Assistant</Typography><Typography fontSize={10} sx={{ opacity: .82, letterSpacing: ".08em" }}>{info.name.toUpperCase()} CONTEXT</Typography></Box>
            <IconButton onClick={clearChat} aria-label="Clear chat" title="Clear chat" sx={{ color: "white" }}><RestartAltRoundedIcon fontSize="small" /></IconButton>
            <IconButton onClick={close} aria-label="Close AI assistant" sx={{ color: "white" }}><CloseRoundedIcon fontSize="small" /></IconButton>
          </Box>
          <Box sx={{ px: 2, py: 1, display: "flex", alignItems: "center", gap: .75, bgcolor: "#F6F8FF", borderBottom: "1px solid #E7ECF7" }}><ShieldOutlinedIcon sx={{ color: "#17845B", fontSize: 16 }} /><Typography variant="caption" color="#53647E">Uses the current page and available workspace data.</Typography></Box>

          <Stack ref={chatBodyRef} spacing={1.25} sx={{ flex: 1, overflowY: "auto", p: 2 }}>
            {messages.map((message, index) => (
              <Box key={index} sx={{ maxWidth: message.matchedCandidates ? "100%" : "88%", alignSelf: message.from === "user" ? "flex-end" : "flex-start" }}>

                {/* Message Text */}
                {message.text && (
                  <Box sx={{ px: 1.4, py: 1.15, borderRadius: "16px 16px 16px 4px", bgcolor: "#F0F3F9", color: "#334155", fontSize: 12.5, lineHeight: 1.55, whiteSpace: "pre-line" }}>
                    {message.text}
                  </Box>
                )}

                {message.matchedCandidates && (
                  <Stack spacing={.8} mt={.8}>
                    {message.matchedCandidates.map((c) => (
                      <Paper
                        key={c.id}
                        elevation={0}
                        onClick={() => navigate("/recruit/dashboard/view-profile-details", {
                          state: {
                            candidateId: c.id,
                            job_details_id: c.job_details_id,
                            status: c.status,
                            list: message.matchedCandidates.map((m) => ({ id: m.id, status: m.status })),
                          },
                        })}
                        sx={{
                          p: 1.2, borderRadius: 2.5, border: "1px solid #E7ECF7", bgcolor: "#fff",
                          cursor: "pointer", transition: "border-color .15s, box-shadow .15s",
                          "&:hover": { borderColor: "#244DCD", boxShadow: "0 2px 10px rgba(36,77,205,.12)" },
                        }}
                      >
                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                          <Box sx={{ minWidth: 0 }}>
                            <Typography fontSize={12.5} fontWeight={800} color="#1E315C" noWrap>{c.candidate_name}</Typography>
                            <Typography fontSize={11} color="#52637F">CLIN{c.clin_id} · {c.designation}</Typography>
                          </Box>
                          <Chip label={`${Math.round(c.match_score)}% match`} size="small" sx={{ height: 20, fontSize: 10, fontWeight: 800, bgcolor: "#E8F5E9", color: "#2E7D32", flexShrink: 0, ml: 1 }} />
                        </Stack>
                        <Stack direction="row" spacing={1.5} mt={.7} flexWrap="wrap" useFlexGap>
                          <Typography fontSize={10.5} color="#8B97AC">Exp: <b style={{ color: "#334155" }}>{c.total_experience}</b></Typography>
                          <Typography fontSize={10.5} color="#8B97AC">Availability: <b style={{ color: "#334155" }}>{formatAvailability(c.availability)}</b></Typography>
                          <Typography fontSize={10.5} color="#8B97AC">Location: <b style={{ color: "#334155" }}>{c.location}, {c.country}</b></Typography>
                        </Stack>
                      </Paper>
                    ))}
                  </Stack>
                )}

                {/* Action Button (Open Pipeline, etc.) */}
                {message.label && (
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => navigate(message.path, { state: message.state })}
                    sx={{
                      mt: 1,
                      textTransform: "none",
                      fontWeight: 800,
                      borderRadius: 2
                    }}
                  >
                    {message.label}
                  </Button>
                )}

                {message.skills && (
                  <Stack direction="row" spacing={.6} mt={.7} flexWrap="wrap" useFlexGap>
                    {message.skills.map((skill) => <Chip key={skill.key} label={skill.lable} size="small" variant="outlined" color="primary" />)}
                  </Stack>
                )}

              </Box>
            ))}

            {jobWizard}

            {!jobStep && loadingClinicalSkills && (
              <Box sx={{ alignSelf: "flex-start", display: "flex", alignItems: "center", gap: 1, px: 1.4 }}>
                <CircularProgress size={12} />
                <Typography fontSize={11.5} color="#8B97AC">Loading clinical skills…</Typography>
              </Box>
            )}
            {matchingLoading && (
              <Box sx={{ alignSelf: "flex-start", width: "100%" }}>
                <MatchingCandidatesLoader />
              </Box>
            )}
            {!jobStep && stageAction && (
              <Button size="small" variant="outlined" onClick={() => onViewStage?.(stageAction.stage)} sx={{ alignSelf: "flex-start", textTransform: "none", fontWeight: 800 }}>
                {stageAction.stageLabel}
              </Button>
            )}

          </Stack>

          <Box sx={{ p: 1.5, borderTop: "1px solid #E7ECF7" }}>
            <Stack direction="row" spacing={.6} sx={{ mb: 1, overflowX: "auto", pb: .25 }}>
              {info.prompts.map((prompt) => <Chip key={prompt} label={prompt} onClick={() => ask(prompt)} size="small" sx={{ bgcolor: "#F1F4FF", color: "#3156C9", fontWeight: 700, fontSize: 10.5 }} />)}
            </Stack>
            <Stack direction="row" spacing={1}>
              <TextField value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => event.key === "Enter" && ask()} fullWidth size="small" placeholder={"Ask about " + info.name + "..."} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2.5, bgcolor: "#FAFBFF", fontSize: 12 } }} />
              <IconButton onClick={() => ask()} disabled={!input.trim()} aria-label="Send message" sx={{ width: 40, height: 40, bgcolor: "#244DCD", color: "white", borderRadius: 2.5 }}><SendRoundedIcon fontSize="small" /></IconButton>
            </Stack>
          </Box>
        </Paper>
      }
      {!open && (
        <Tooltip title="Drag to move · click to open" placement="left">
          <IconButton
            onPointerDown={handleBubblePointerDown}
            onClick={handleBubbleClick}
            aria-label="Ask Ri8 Assistant"
            sx={{
              width: 52,
              height: 52,
              borderRadius: "50%",
              color: "#7C97EE",
              bgcolor: "transparent",
              boxShadow: "none",
              "&:hover": { bgcolor: "rgba(36,77,205,.08)" },
              touchAction: "none",
              cursor: "grab",
              "&:active": { cursor: "grabbing" },
              zIndex: 1400,
            }}
          >
            <AutoAwesomeRoundedIcon />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );

}

export default memo(DashboardAiAssistant)