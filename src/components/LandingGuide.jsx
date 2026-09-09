import React, { useState } from "react";
import { createPortal } from "react-dom";
import { LANDING_GUIDE_KNOWLEDGE_BASE } from "./landingGuideKnowledgeBase";
import { retrieveAnswer } from "./aiAssistant/retrieval";

const quickPrompts = ["What is Ri8Fit?", "Clinical hiring", "Create a job", "How does matching work?"];
const welcomeMessage = {
  from: "ai",
  text: "Hi — I’m Ri8Fit Guide. Ask me about our hiring platform, clinical skill intelligence, candidate matching, interviews, user roles, or how to get started.",
};

const getAnswer = (question) => {
  const q = question.toLowerCase();
  if (/^(hi|hello|hey|good morning|good afternoon|good evening)\b/.test(q.trim())) {
    return {
      text: "Hello! I’m the Ri8Fit Guide. I can explain our hiring platform, clinical skill intelligence, candidate matching, interviews, user roles, and how to get started.",
    };
  }

  const match = retrieveAnswer(question, LANDING_GUIDE_KNOWLEDGE_BASE);
  if (match) return { text: match.entry.answer, ...match.entry.action };

  return {
    text: "I can help with Ri8Fit’s product overview, clinical hiring, candidate matching, job creation, interviews, user roles, and the hiring workflow. Try asking: “What is Ri8Fit?” or “How does candidate matching work?”",
  };
};

export default function LandingGuide({ T, navigate }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([welcomeMessage]);
  const dark = T.bg0 === "#060b14";
  const ask = (question = input) => {
    const clean = question.trim();
    if (!clean) return;
    setMessages((current) => [...current, { from: "user", text: clean }, { from: "ai", ...getAnswer(clean) }]);
    setInput("");
  };
  const panel = { background: dark ? "rgba(11,18,32,.97)" : "rgba(255,255,255,.98)", border: "1px solid " + T.tealBd, boxShadow: "0 24px 70px " + T.tealGlow };
  const aiGradient = "linear-gradient(135deg," + T.teal + "," + T.violet + ")";
  return createPortal(
    <div style={{ position: "fixed", right: "clamp(16px,3vw,34px)", bottom: "clamp(16px,3vw,30px)", zIndex: 1600, fontFamily: T.sans, isolation: "isolate" }}>
      {open && <div style={{ ...panel, width: "min(390px,calc(100vw - 32px))", height: "min(555px,calc(100vh - 110px))", borderRadius: 22, overflow: "hidden", display: "flex", flexDirection: "column", marginBottom: 12, backdropFilter: "blur(20px)" }}>
        <div style={{ padding: "15px 17px", display: "flex", alignItems: "center", gap: 10, background: "linear-gradient(110deg," + T.teal + "22," + T.violet + "18)" }}>
          <div style={{ width: 34, height: 34, borderRadius: 12, background: aiGradient, display: "grid", placeItems: "center", color: "white", fontSize: 17, animation: "ri8Pulse 2.5s ease-in-out infinite" }}>✦</div>
          <div style={{ flex: 1 }}><div style={{ color: T.textPrimary, fontWeight: 800, fontSize: ".9rem" }}>Ri8Fit Guide</div><div style={{ color: T.emerald, fontFamily: T.mono, fontSize: ".59rem", marginTop: 2 }}>● WORKFLOW ASSISTANT</div></div>
          <button onClick={() => { setMessages([welcomeMessage]); setInput(""); }} aria-label="Clear guide chat" title="Clear chat" style={{ border: 0, background: "transparent", color: T.textMuted, cursor: "pointer", fontSize: 19, lineHeight: 1 }}>↻</button>
          <button onClick={() => setOpen(false)} aria-label="Close guide" style={{ border: 0, background: "transparent", color: T.textMuted, cursor: "pointer", fontSize: 20 }}>×</button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
          {messages.map((message, index) => <div key={index} style={{ alignSelf: message.from === "user" ? "flex-end" : "flex-start", maxWidth: "90%" }}>
            <div style={{ padding: "10px 12px", borderRadius: message.from === "user" ? "15px 15px 4px 15px" : "15px 15px 15px 4px", background: message.from === "user" ? aiGradient : T.bg2, color: message.from === "user" ? "white" : T.textSecond, border: message.from === "user" ? "none" : "1px solid " + T.border, fontSize: ".78rem", lineHeight: 1.58 }}>{message.text}</div>
            {message.label && <button onClick={() => navigate(message.path)} style={{ marginTop: 7, background: "transparent", border: "1px solid " + T.tealBd, color: T.teal, borderRadius: 8, padding: "6px 9px", fontFamily: T.sans, fontSize: ".71rem", fontWeight: 700, cursor: "pointer" }}>{message.label} →</button>}
          </div>)}
        </div>
        <div style={{ padding: "10px 13px 13px", borderTop: "1px solid " + T.border }}>
          <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 9 }}>{quickPrompts.map((item) => <button key={item} onClick={() => ask(item)} style={{ whiteSpace: "nowrap", padding: "5px 8px", borderRadius: 20, border: "1px solid " + T.tealBd, background: T.tealBg, color: T.teal, fontSize: ".64rem", fontWeight: 700, cursor: "pointer" }}>{item}</button>)}</div>
          <div style={{ display: "flex", gap: 7 }}><input value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => event.key === "Enter" && ask()} placeholder="Ask about your hiring workflow..." style={{ minWidth: 0, flex: 1, border: "1px solid " + T.border, background: T.bg1, color: T.textPrimary, borderRadius: 10, padding: "10px 11px", outline: "none", fontFamily: T.sans, fontSize: ".75rem" }} /><button onClick={() => ask()} aria-label="Ask Ri8Fit Guide" style={{ width: 38, border: 0, borderRadius: 10, background: aiGradient, color: "white", cursor: "pointer", fontWeight: 800 }}>↑</button></div>
          <div style={{ color: T.textMuted, fontSize: ".56rem", marginTop: 7, fontFamily: T.mono }}>GUIDANCE ONLY · FINAL HIRING DECISIONS REQUIRE HUMAN REVIEW</div>
        </div>
      </div>}
      <button onClick={() => setOpen((value) => !value)} aria-label="Open Ri8Fit workflow guide" style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 9, border: "1px solid " + T.tealBd, borderRadius: 30, padding: "10px 15px 10px 11px", background: "linear-gradient(135deg," + T.bgGlass + "," + T.tealBg + ")", color: T.textPrimary, cursor: "pointer", fontFamily: T.sans, fontWeight: 800, fontSize: ".76rem", boxShadow: "0 12px 34px " + T.tealGlow }}><span style={{ width: 28, height: 28, borderRadius: 10, display: "grid", placeItems: "center", background: aiGradient, color: "white", animation: "ri8Pulse 2.5s ease-in-out infinite" }}>✦</span>{open ? "Close guide" : "Ask Ri8Fit Guide"}</button>
    </div>,
    document.body,
  );
}
