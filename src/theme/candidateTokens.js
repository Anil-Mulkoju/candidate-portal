// src/theme/candidateTokens.js

export const palette = {
  ink: "#12302D",       // primary text
  tealDeep: "#0E4A45",  // gradient end / pressed states
  teal: "#1C6F67",      // brand / primary actions
  tealSoft: "#E7F1EF",  // teal tint background
  amber: "#D89A2B",     // in-progress accent
  amberSoft: "#FBF1DD",
  coral: "#E2604B",     // incomplete / alert accent
  coralSoft: "#FBE9E6",
  canvas: "#F2F6F4",    // page background
  paper: "#FFFFFF",
  line: "#E3E9E6",      // hairline borders
  muted: "#6C7C79",     // secondary text
};

export const fonts = {
  // Add this once to your index.html <head>:
  // <link rel="preconnect" href="https://fonts.googleapis.com">
  // <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  display: '"Fraunces", "Georgia", serif',
  body: '"Inter", "Helvetica Neue", Arial, sans-serif',
  mono: '"JetBrains Mono", "Roboto Mono", monospace',
};

export const radius = {
  card: 14,
  pill: 999,
  chip: 8,
};