// ─────────────────────────────────────────────────────────────────────────
// Product knowledge base for the Ri8 Assistant.
//
// Each entry is a retrievable "fact card" about a real feature of the app
// (derived from the actual pages/flows in this codebase, not invented copy).
// `keywords` should include the different ways a user might phrase the same
// question — the retrieval scorer in `retrieval.js` matches against these
// plus the tokens in `question`, so more variety here means better recall.
//
// `action` (optional) lets an entry offer a one-click navigation button,
// same shape as the rest of the assistant's message objects: { label, path, state }.
// ─────────────────────────────────────────────────────────────────────────

export const PRODUCT_KNOWLEDGE_BASE = [
  // ── Product overview ────────────────────────────────────────────────────
  {
    id: "product-overview",
    category: "overview",
    question: "What is this product?",
    keywords: ["what is ri8fit", "what is this", "what is this app", "what is this platform", "product", "about", "what does this do", "what can this platform do"],
    answer: "Ri8fit is a clinical/IT/non-IT hiring platform. You can post job requisitions, track candidates through the hiring pipeline (application → shortlisted → interview → selected → offer → onboarded), schedule interviews, and review dashboard analytics — all from this app.",
  },
  {
    id: "who-are-you",
    category: "overview",
    question: "Who are you?",
    keywords: ["who are you", "your name", "what are you", "are you a bot", "are you human", "are you ai"],
    answer: "I'm the Ri8 Assistant — a built-in helper for this app. I can answer questions about how features here work, look up a candidate or job by ID, and walk you through creating a job step by step.",
  },
  {
    id: "capabilities",
    category: "overview",
    question: "What can you do?",
    keywords: ["what can you do", "help", "capabilities", "what can you help with", "how can you help"],
    answer: "I can:\n• Answer questions about how this app works (jobs, pipeline, candidates, interviews, roles, settings)\n• Guide you through creating a job, one field at a time\n• Jump you to a candidate, job, or requisition by ID\n• Tell you live counts (e.g. \"how many shortlisted candidates\") from the current dashboard\n\nJust ask in plain language, or say \"Start job creation\" to begin the wizard.",
  },

  // ── Jobs / Requisitions ─────────────────────────────────────────────────
  {
    id: "job-statuses",
    category: "jobs",
    question: "What do job statuses mean?",
    keywords: ["job status", "open job", "closed job", "on hold job", "what does open mean", "what does closed mean", "status meaning"],
    answer: "A job can be:\n• Open — actively accepting candidates\n• On Hold — paused, not receiving new candidates until resumed\n• Closed — no longer active\n\nYou can filter the Requisitions table by these statuses at the top of the page.",
  },
  {
    id: "create-job-domains",
    category: "jobs",
    question: "What domains can a job be created for?",
    keywords: ["job domain", "clinical job", "it job", "non-it job", "types of jobs", "kinds of jobs"],
    answer: "Jobs can be created under three domains: Clinical, IT, and Non-IT. Clinical jobs additionally ask for a function/sub-function (e.g. Clinical Data Management, Bio Statistics) and clinical-specific skills; IT and Non-IT jobs use a general skills list instead.",
  },
  {
    id: "edit-job",
    category: "jobs",
    question: "How do I edit a job?",
    keywords: ["edit job", "update job", "change job details", "modify requisition"],
    answer: "Open the job from the Requisitions table (click the row) to go to its Job Details page, where you can edit its fields, put it on hold/resume it, or delete it.",
    action: { label: "Open Requisitions", path: "/recruit/requisitions" },
  },
  {
    id: "delete-job",
    category: "jobs",
    question: "How do I delete a job?",
    keywords: ["delete job", "remove job", "delete requisition", "can i delete a job", "who can delete a job"],
    answer: "Delete a job from the row actions menu (⋮) in the Requisitions table, or from the Delete button on its Job Details page.\n\nWhat happens next depends on your role:\n• A Super Admin's delete goes through immediately.\n• Any other user's delete request is sent for Super Admin approval instead — the job stays unchanged until a Super Admin approves it. You'll see a confirmation message either way.",
    action: { label: "Open Requisitions", path: "/recruit/requisitions" },
  },
  {
    id: "approve-delete-request",
    category: "jobs",
    question: "How do I approve a delete request?",
    keywords: ["approve delete", "approve request", "pending approval", "action request", "approval notification", "notification bell"],
    answer: "Super Admins see a bell icon with a badge count in the top app bar. Click it to see pending approval requests (like job-deletion requests submitted by other users) and approve each one directly from that list.",
  },
  {
    id: "pipeline",
    category: "jobs",
    question: "How does the pipeline work?",
    keywords: ["pipeline", "hiring pipeline", "candidate pipeline", "pipeline stages", "how does pipeline work"],
    answer: "The Pipeline tracks candidates through hiring stages for a specific job: Application → Shortlisted → Interview → Selected → Offer → Onboarded. Candidates can also be Rejected at any stage. Open a job's Pipeline tab to see and move candidates between stages.",
  },
  {
    id: "timeline",
    category: "jobs",
    question: "What is the timeline?",
    keywords: ["timeline", "requisition timeline", "job history", "activity history", "view timeline"],
    answer: "The requisition Timeline records job updates, candidate activity, interviews, feedback, and each stage change — a running history of everything that's happened on that job.",
    action: { label: "Open Requisitions", path: "/recruit/requisitions" },
  },
  {
    id: "job-approver-recruiters",
    category: "jobs",
    question: "What is a job approver?",
    keywords: ["job approver", "approver role in job", "recruiter team", "ta team"],
    answer: "Every job has one Approver (who reviews/approves it) and can have multiple Recruiters/TA team members assigned as collaborators. You set both while creating the job, in the Team step.",
  },

  // ── Candidates ───────────────────────────────────────────────────────────
  {
    id: "candidate-stages",
    category: "candidates",
    question: "What are the candidate stages?",
    keywords: ["candidate stage", "candidate status", "shortlisted meaning", "onboarded meaning", "matched meaning", "stage breakdown"],
    answer: "A candidate moves through: Application (matched) → Shortlisted → Interviewing → Selected → Offer Released (then Accepted / Rejected / Revoked) → Onboarded. A candidate can also be Rejected at any point along the way.",
  },
  {
    id: "shortlist-reject",
    category: "candidates",
    question: "How do I shortlist or reject a candidate?",
    keywords: ["shortlist candidate", "reject candidate", "how to shortlist", "how to reject", "review candidates", "review candidate"],
    answer: "Review the candidate against the job's criteria, then use the Shortlist or Reject action on their candidate card. For rejections, record a clear, job-related reason.",
    action: { label: "Open Candidates", path: "/recruit/candidates" },
  },
  {
    id: "resume-upload",
    category: "candidates",
    question: "How do I upload or view a resume?",
    keywords: ["upload resume", "view resume", "candidate resume", "cv upload"],
    answer: "Candidates can upload a resume during registration. Recruiters/interviewers can view an already-uploaded resume from the candidate's details — look for the resume icon next to the candidate's name.",
  },
  {
    id: "candidate-matching",
    category: "candidates",
    question: "How does candidate matching work?",
    keywords: ["candidate matching", "matching candidates", "match score", "find matching candidates"],
    answer: "After a job is created, the system automatically searches for matching candidates and shows a match score for each based on the job's skill and experience requirements.",
  },

  // ── Interviews ───────────────────────────────────────────────────────────
  {
    id: "schedule-interview",
    category: "interviews",
    question: "How do I schedule an interview?",
    keywords: ["schedule interview", "book interview", "set up interview", "interview round", "interview flow", "interview process"],
    answer: "From a candidate in the pipeline, add an interview round — set the interviewer(s), date, and time. You can schedule multiple rounds per candidate and track each round's status (Scheduled, Completed, Rescheduled, Cancelled, No Show).",
    action: { label: "Open Interviews", path: "/recruit/interviews" },
  },
  {
    id: "interview-statuses",
    category: "interviews",
    question: "What do interview statuses mean?",
    keywords: ["interview status", "rescheduled meaning", "no show meaning", "interview cancelled"],
    answer: "An interview round can be Scheduled, Completed, Rescheduled, Cancelled, or No Show. These are tracked per round and shown on the dashboard's Interviews Count by Status chart.",
  },
  {
    id: "interview-feedback",
    category: "interviews",
    question: "Where do I leave interview feedback?",
    keywords: ["interview feedback", "leave feedback", "rate candidate", "interview review"],
    answer: "After an interview round, open it from the candidate's pipeline to record feedback and an outcome for that round.",
  },

  // ── Dashboard ────────────────────────────────────────────────────────────
  {
    id: "dashboard-toggle",
    category: "dashboard",
    question: "What is the Current vs Cumulative toggle?",
    keywords: ["current vs cumulative", "cumulative toggle", "current toggle", "counts type"],
    answer: "Cumulative shows the total number of candidates who have ever reached a stage. Current shows only candidates presently sitting in that stage right now. Toggle between them above the analytics charts.",
  },
  {
    id: "dashboard-users-toggle",
    category: "dashboard",
    question: "What is the All Users / Current User toggle?",
    keywords: ["all users toggle", "current user toggle", "organisation view", "my dashboard"],
    answer: "All Users shows analytics across everyone in your organization; Current User filters the same dashboard down to just your own jobs and candidates.",
  },
  {
    id: "dashboard-export",
    category: "dashboard",
    question: "How do I export the dashboard?",
    keywords: ["export dashboard", "download pdf", "dashboard pdf", "print dashboard"],
    answer: "Use the download icon near the top-right of the Dashboard to export the current analytics view as a PDF.",
  },

  // ── Settings & Roles ─────────────────────────────────────────────────────
  {
    id: "roles-overview",
    category: "roles",
    question: "What are the different user roles?",
    keywords: ["user roles", "role types", "super admin", "hm user", "hiring manager role", "interview user role", "admin role", "permissions"],
    answer: "This app has four roles:\n• Super Admin — full access, including approving delete/other action requests\n• Admin — organization-wide management access\n• HM User (Hiring Manager) — creates/manages jobs and candidates; some actions (like deleting a job) require Super Admin approval\n• Interview User — focused on interviews and candidates only\n\nWhat you see in the sidebar and what actions you can take directly depend on your role.",
  },
  {
    id: "user-management",
    category: "settings",
    question: "How do I manage users?",
    keywords: ["user management", "add user", "invite user", "manage employees", "team members"],
    answer: "Go to Settings → User Management to view, add, or manage people in your organization.",
    action: { label: "Open Settings", path: "/recruit/settings/user-management" },
  },
  {
    id: "organization-settings",
    category: "settings",
    question: "Where do I update organization details?",
    keywords: ["organization settings", "company details", "billing details", "organisation settings"],
    answer: "Go to Settings → Organization to update your company's details.",
    action: { label: "Open Settings", path: "/recruit/settings/organization" },
  },
  {
    id: "department-settings",
    category: "settings",
    question: "How do departments work?",
    keywords: ["department", "add department", "department settings"],
    answer: "Go to Settings → Department to view and manage the departments in your organization.",
    action: { label: "Open Settings", path: "/recruit/settings/Department" },
  },
  {
    id: "my-profile",
    category: "settings",
    question: "How do I update my profile?",
    keywords: ["my profile", "update profile", "change my details", "profile settings"],
    answer: "Click your avatar in the top-right corner and choose My Profile, or go to Settings → My Profile.",
    action: { label: "Open My Profile", path: "/recruit/settings/profile-details" },
  },
];
