// Static, public-facing product information for the Ri8Fit landing-page guide.
// Keep this separate from the in-app assistant knowledge base: visitors do not
// yet have access to organisation-specific data or authenticated workflows.
export const LANDING_GUIDE_KNOWLEDGE_BASE = [
  {
    id: "what-is-ri8fit",
    question: "What is Ri8Fit?",
    keywords: ["ri8fit", "what is ri8fit", "about ri8fit", "platform", "product", "what do you do"],
    answer: "Ri8Fit is a hiring management platform with a built-in ATS for Clinical, IT, and Non-IT teams. It brings job creation, candidate matching, interviews, workflow tracking, and analytics into one place.",
  },
  {
    id: "clinical-intelligence",
    question: "How does Ri8Fit support clinical hiring?",
    keywords: ["clinical", "clinical hiring", "clinical roles", "clinical intelligence", "life sciences", "clinical skills", "cdm", "biostatistics", "pharmacovigilance"],
    answer: "Ri8Fit supports clinical hiring with role-specific skill frameworks, mandatory and weighted skills, domain-aware matching, and explainable candidate-fit information for specialised life-sciences roles.",
  },
  {
    id: "candidate-matching",
    question: "How does candidate matching work?",
    keywords: ["match", "matching", "match score", "find candidates", "candidate score", "ai matching", "skill matching"],
    answer: "When a job includes its required skills and experience criteria, Ri8Fit helps surface relevant candidates and presents their fit against those requirements. Hiring teams should always review the profile before making a decision.",
  },
  {
    id: "create-job",
    question: "How do I create a job?",
    keywords: ["create job", "post job", "new job", "add requisition", "create requisition"],
    answer: "After signing in, start a new requisition, add the role, domain, skills, experience and hiring-team details, review the summary, then publish it. Ri8Fit keeps the job and its candidate workflow connected.",
    action: { label: "Sign in to create a job", path: "/recruit/login" },
  },
  {
    id: "pipeline",
    question: "What is the hiring workflow?",
    keywords: ["pipeline", "workflow", "hiring workflow", "candidate stages", "move candidate", "process"],
    answer: "The hiring workflow keeps every candidate's progress visible, from application and screening through interviews, selection, offer, and onboarding. Teams can review activity and stage changes in one connected process.",
  },
  {
    id: "shortlist-reject",
    question: "How do I shortlist or reject a candidate?",
    keywords: ["shortlist", "reject", "shortlist candidate", "reject candidate", "candidate decision"],
    answer: "Review the candidate against the approved job criteria, then choose Shortlist or Reject from the candidate workflow. Use a clear, job-related reason for a rejection and keep the final decision with your hiring team.",
  },
  {
    id: "interviews",
    question: "Can Ri8Fit manage interviews?",
    keywords: ["interview", "schedule interview", "interviewer", "feedback", "interview rounds"],
    answer: "Yes. Ri8Fit helps teams schedule interview rounds, coordinate interviewers, track each round's status, and capture feedback as candidates move through the process.",
  },
  {
    id: "roles",
    question: "What user roles are available?",
    keywords: ["roles", "user roles", "super admin", "admin", "hiring manager", "hm user", "interview user", "permissions"],
    answer: "Ri8Fit includes Super Admin, Admin, HM User (Hiring Manager), and Interview User roles. Each role is given access appropriate to its responsibilities, while Super Admins manage organization-wide controls.",
  },
  {
    id: "getting-started",
    question: "How do I get started?",
    keywords: ["get started", "start", "sign in", "login", "begin", "demo"],
    answer: "Start by signing in, setting up your organization and team, then creating your first job requisition. From there, add or review candidates and follow them through the hiring workflow.",
    action: { label: "Sign in", path: "/recruit/login" },
  },
];
