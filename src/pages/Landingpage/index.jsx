import React, { useEffect, useRef, useState } from 'react';
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import logoLight from "../../assets/ri8fit-logo222.svg";
import logoDark from "../../assets/ri8fit-logo.svg";
import Ri8fit_Logo from "../../assets/Ri8fit_Logo3.png"
import Ri8fit_Logo2 from "../../assets/Ri8fit_Logo6.png"
import { useLocation, useNavigate } from 'react-router-dom';
// import React, { useState, useEffect } from 'react';
// Import the specific icons you need
import SpeedIcon from '@mui/icons-material/Speed';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import BoltIcon from '@mui/icons-material/Bolt';
import BiotechIcon from '@mui/icons-material/Biotech';
import LandingGuide from "../../components/LandingGuide";

// ─── THEME TOKENS ────────────────────────────────────────────────────────────
const LIGHT = {
  bg0: "#ffffff", bg1: "#f8fafc", bg2: "#f1f5f9",
  bgGlass: "rgba(255,255,255,0.96)",
  border: "#e2e8f0", borderM: "#cbd5e1",
  teal: "#0ea5e9", tealL: "#38bdf8", tealD: "#0369a1",
  tealGlow: "rgba(14,165,233,0.20)", tealBg: "rgba(14,165,233,0.07)", tealBd: "rgba(14,165,233,0.22)",
  amber: "#0f766e", amberL: "#14b8a6", amberD: "#0f766e",
  amberBg: "rgba(20,184,166,0.07)", amberBd: "rgba(20,184,166,0.22)",
  emerald: "#10b981", emeraldL: "#34d399",
  emeraldBg: "rgba(16,185,129,0.07)", emeraldBd: "rgba(16,185,129,0.22)",
  violet: "#8b5cf6", violetL: "#a78bfa",
  violetBg: "rgba(139,92,246,0.07)", violetBd: "rgba(139,92,246,0.22)",
  rose: "#f43f5e", roseBg: "rgba(244,63,94,0.07)", roseBd: "rgba(244,63,94,0.22)",
  textPrimary: "#0f172a", textSecond: "#1e2937", textMuted: "#475569", textInvert: "#ffffff",
  sans: "'Inter','Poppins',-apple-system,BlinkMacSystemFont,sans-serif",
  mono: "'JetBrains Mono',monospace",
  waveAlpha: [0.05, 0.035, 0.025, 0.018],
  blobAlpha: [".04", ".032", ".025", ".018"],
  navBg: "rgba(255,255,255,0.98)", stageBg: "#f8fafc",
  feedBg: "rgba(14,165,233,0.05)", stepBg: "#ffffff",
  skillTrack: "rgba(0,0,0,0.06)", statBg: "rgba(255,255,255,0.98)",
  candidateRowBg: "rgba(0,0,0,0.018)", shortlistBg: "#f8fafc",
  offerProgressBg: "#f8fafc", stageItem: "#ffffff", progressTrack: "rgba(0,0,0,0.06)",
};

const DARK = {
  bg0: "#060b14", bg1: "#0b1220", bg2: "#111927",
  bgGlass: "rgba(11,18,32,0.92)",
  border: "rgba(255,255,255,0.13)", borderM: "rgba(255,255,255,0.20)",
  teal: "#38bdf8", tealL: "#7dd3fc", tealD: "#0369a1",
  tealGlow: "rgba(56,189,248,0.45)", tealBg: "rgba(56,189,248,0.15)", tealBd: "rgba(56,189,248,0.40)",
  amber: "#2dd4bf", amberL: "#5eead4", amberD: "#0f766e",
  amberBg: "rgba(45,212,191,0.15)", amberBd: "rgba(45,212,191,0.40)",
  emerald: "#34d399", emeraldL: "#6ee7b7",
  emeraldBg: "rgba(52,211,153,0.15)", emeraldBd: "rgba(52,211,153,0.40)",
  violet: "#a78bfa", violetL: "#c4b5fd",
  violetBg: "rgba(167,139,250,0.15)", violetBd: "rgba(167,139,250,0.40)",
  rose: "#fb7185", roseBg: "rgba(251,113,133,0.15)", roseBd: "rgba(251,113,133,0.40)",
  textPrimary: "#f0f9ff", textSecond: "#bae6fd", textMuted: "#fff", textInvert: "#ffffff",
  sans: "'Inter','Poppins',-apple-system,BlinkMacSystemFont,sans-serif",
  mono: "'JetBrains Mono',monospace",
  waveAlpha: [0.22, 0.17, 0.14, 0.11],
  blobAlpha: [".25", ".19", ".15", ".13"],
  navBg: "rgba(6,11,20,0.97)", stageBg: "rgba(56,189,248,0.07)",
  feedBg: "rgba(56,189,248,0.10)", stepBg: "rgba(255,255,255,0.04)",
  skillTrack: "rgba(255,255,255,0.10)", statBg: "rgba(11,18,32,0.90)",
  candidateRowBg: "rgba(255,255,255,0.05)", shortlistBg: "rgba(255,255,255,0.05)",
  offerProgressBg: "rgba(255,255,255,0.05)", stageItem: "rgba(255,255,255,0.06)", progressTrack: "rgba(255,255,255,0.10)",
};

// ─── GLOBAL CSS ──────────────────────────────────────────────────────────────
const GLOBAL_CSS = (T) => `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap');
  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
  html, body, #root { width:100%; background:${T.bg0}; transition:background .35s; }
  ::-webkit-scrollbar { width:4px; }
  ::-webkit-scrollbar-track { background:${T.bg1}; }
  ::-webkit-scrollbar-thumb { background:${T.teal}66; border-radius:10px; }
  ::selection { background:${T.tealGlow}; color:${T.textInvert}; }
  @keyframes scBl1 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(44px,-52px) scale(1.06)} 66%{transform:translate(-27px,29px) scale(.96)} }
  @keyframes scBl2 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-50px,-40px) scale(1.09)} }
  @keyframes scBl3 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(33px,42px)} }
  @keyframes scBl4 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-18px,26px) scale(1.04)} }
  @keyframes ri8Grad { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
  @keyframes ri8FadeUp { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
  @keyframes ri8Pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.3;transform:scale(.78)} }
  @keyframes ri8Blink { 0%,100%{opacity:1} 50%{opacity:0} }
  @keyframes flashSlide { 0%{opacity:0;transform:translateX(-18px)} 12%{opacity:1;transform:translateX(0)} 80%{opacity:1;transform:translateX(0)} 100%{opacity:0;transform:translateX(18px)} }
  .ri8-hero-gradient-text {
    font-weight:800;
    background:linear-gradient(90deg,${T.teal},${T.violetL},${T.amberL});
    -webkit-background-clip:text; -webkit-text-fill-color:transparent;
    background-clip:text; letter-spacing:-0.03em; display:block;
    background-size:200% auto; animation:ri8Grad 4s ease infinite;
  }
`;

// ─── BACKGROUND EFFECTS ──────────────────────────────────────────────────────
function AuroraCanvas({ T }) {
  const ref = useRef();
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d"); let W, H, t = 0, raf;
    const resize = () => { W = c.width = window.innerWidth; H = c.height = Math.min(window.innerHeight, 800); };
    const WAVES = [
      { amp: 0.36, freq: 0.00055, phase: 0, rgb: [56, 189, 248], a: T.waveAlpha[0] },
      { amp: 0.24, freq: 0.00085, phase: 1.3, rgb: [45, 212, 191], a: T.waveAlpha[1] },
      { amp: 0.20, freq: 0.00045, phase: 2.5, rgb: [167, 139, 250], a: T.waveAlpha[2] },
      { amp: 0.15, freq: 0.001, phase: 0.8, rgb: [52, 211, 153], a: T.waveAlpha[3] },
    ];
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      WAVES.forEach(({ amp, freq, phase, rgb: [r, g, b], a }) => {
        ctx.beginPath(); ctx.moveTo(0, H);
        for (let x = 0; x <= W; x += 5) {
          const y = H * 0.5 + Math.sin(x * freq + t + phase) * H * amp + Math.cos(x * freq * 0.4 + t * 0.7 + phase) * H * 0.07;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath();
        const g2 = ctx.createLinearGradient(0, 0, 0, H);
        g2.addColorStop(0, `rgba(${r},${g},${b},${a})`);
        g2.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.fillStyle = g2; ctx.fill();
      });
      t += 0.0035; raf = requestAnimationFrame(draw);
    };
    resize(); draw(); window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, [T]);
  return <canvas ref={ref} style={{ position: "fixed", top: 0, left: 0, width: "100%", zIndex: 0, pointerEvents: "none", opacity: 0.9 }} />;
}

function ParticleField() {
  const ref = useRef();
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d");
    let W, H, pts, mouse = { x: -9999, y: -9999 }, raf;
    const resize = () => { W = c.width = window.innerWidth; H = c.height = window.innerHeight; };
    const mk = () => ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - 0.5) * 0.38, vy: (Math.random() - 0.5) * 0.38, r: Math.random() * 1.4 + 0.4, hue: [197, 45, 160, 150][Math.floor(Math.random() * 4)], life: Math.random() * Math.PI * 2, spd: 0.005 + Math.random() * 0.009 });
    const init = () => { pts = Array.from({ length: 72 }, mk); };
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      pts.forEach((p, i) => {
        p.life += p.spd;
        const a = 0.18 + 0.28 * Math.sin(p.life);
        const dx = p.x - mouse.x, dy = p.y - mouse.y, d = Math.hypot(dx, dy);
        if (d < 115) { p.vx += (dx / d) * 0.055; p.vy += (dy / d) * 0.055; }
        p.vx *= 0.996; p.vy *= 0.996; p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1; if (p.y < 0 || p.y > H) p.vy *= -1;
        const gr = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 5);
        gr.addColorStop(0, `hsla(${p.hue},72%,72%,${a})`); gr.addColorStop(1, `hsla(${p.hue},72%,72%,0)`);
        ctx.beginPath(); ctx.fillStyle = gr; ctx.arc(p.x, p.y, p.r * 5, 0, Math.PI * 2); ctx.fill();
        for (let j = i + 1; j < pts.length; j++) {
          const q = pts[j], cd = Math.hypot(p.x - q.x, p.y - q.y);
          if (cd < 125) { ctx.beginPath(); ctx.strokeStyle = `hsla(${p.hue},62%,68%,${0.12 * (1 - cd / 125)})`; ctx.lineWidth = 0.55; ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke(); }
        }
      });
      raf = requestAnimationFrame(draw);
    };
    const mv = (e) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    const ml = () => { mouse.x = -9999; mouse.y = -9999; };
    resize(); init(); draw();
    window.addEventListener("resize", () => { resize(); init(); });
    window.addEventListener("mousemove", mv); window.addEventListener("mouseleave", ml);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("mousemove", mv); window.removeEventListener("mouseleave", ml); };
  }, []);
  return <canvas ref={ref} style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", opacity: 0.6 }} />;
}

function SceneBG({ T }) {
  const blobs = [
    { w: "65vw", h: "65vw", top: "-20%", left: "-14%", an: "scBl1 25s ease-in-out infinite" },
    { w: "52vw", h: "52vw", bottom: "-16%", right: "-12%", an: "scBl2 31s ease-in-out infinite" },
    { w: "38vw", h: "38vw", top: "38%", left: "54%", an: "scBl3 20s ease-in-out infinite" },
    { w: "26vw", h: "26vw", top: "12%", right: "16%", an: "scBl4 23s ease-in-out infinite" },
  ];
  const colors = [`rgba(56,189,248,${T.blobAlpha[0]})`, `rgba(45,212,191,${T.blobAlpha[1]})`, `rgba(167,139,250,${T.blobAlpha[2]})`, `rgba(52,211,153,${T.blobAlpha[3]})`];
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
      {blobs.map((b, i) => (<div key={i} style={{ position: "absolute", width: b.w, height: b.h, top: b.top, bottom: b.bottom, left: b.left, right: b.right, borderRadius: "50%", background: `radial-gradient(circle,${colors[i]},transparent 68%)`, animation: b.an }} />))}
    </div>
  );
}

// ─── UI PRIMITIVES ────────────────────────────────────────────────────────────
const Chip = ({ children, color, style: s = {}, T }) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: ".42rem", background: `${color || T.teal}14`, color: color || T.teal, border: `1px solid ${color || T.teal}44`, fontSize: ".62rem", fontWeight: 700, letterSpacing: ".11em", textTransform: "uppercase", padding: ".28rem .88rem", borderRadius: 20, fontFamily: T.mono, ...s }}>
    <span style={{ width: 5, height: 5, borderRadius: "50%", background: color || T.teal, boxShadow: `0 0 7px ${color || T.teal}`, display: "inline-block", animation: "ri8Pulse 2s ease-in-out infinite" }} />
    {children}
  </span>
);

function GCard({ children, style: s = {}, glow, onClick, T }) {
  const [h, setH] = useState(false); const g = glow || T.teal;
  return (
    <div onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} onClick={onClick}
      style={{ background: h ? (T === DARK ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.02)") : T.bgGlass, border: `1px solid ${h ? g + "55" : T.border}`, borderRadius: 18, backdropFilter: "blur(22px)", WebkitBackdropFilter: "blur(22px)", transition: "all .32s cubic-bezier(.4,0,.2,1)", transform: h ? "translateY(-6px) scale(1.012)" : "none", boxShadow: h ? `0 22px 48px ${g}22,0 0 0 1px ${g}1a` : "none", position: "relative", overflow: "hidden", cursor: onClick ? "pointer" : "default", height: "100%", ...s }}>
      {h && <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% 0%,${g}0d,transparent 62%)`, pointerEvents: "none" }} />}
      {children}
    </div>
  );
}

function PrimaryBtn({ children, onClick, style: s = {}, T }) {
  const [h, setH] = useState(false);
  return (
    <button onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} onClick={onClick}
      style={{ background: h ? `linear-gradient(135deg,${T.tealL},${T.amberL})` : `linear-gradient(135deg,${T.teal},${T.amber})`, color: "#ffffff", border: "none", padding: ".72rem 1.88rem", borderRadius: 9, cursor: "pointer", fontFamily: T.sans, fontWeight: 700, fontSize: ".87rem", transition: "all .24s", transform: h ? "translateY(-2px)" : "none", boxShadow: h ? `0 8px 28px ${T.tealGlow}` : "none", display: "inline-flex", alignItems: "center", gap: ".45rem", letterSpacing: ".02em", ...s }}>
      {children}
    </button>
  );
}

function OutlineBtn({ children, onClick, style: s = {}, T }) {
  const [h, setH] = useState(false);
  return (
    <button onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} onClick={onClick}
      style={{ background: h ? `${T.teal}18` : "transparent", color: h ? T.tealL : T.teal, border: `1.5px solid ${h ? T.tealL : T.teal}`, padding: ".72rem 1.88rem", borderRadius: 9, cursor: "pointer", fontFamily: T.sans, fontWeight: 700, fontSize: ".87rem", transition: "all .24s", transform: h ? "translateY(-2px)" : "none", display: "inline-flex", alignItems: "center", gap: ".45rem", letterSpacing: ".02em", ...s }}>
      {children}
    </button>
  );
}

// ─── HOOKS ────────────────────────────────────────────────────────────────────
function useInView(thresh = 0.12) {
  const ref = useRef(); const [v, setV] = useState(false);
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: thresh });
    if (ref.current) o.observe(ref.current); return () => o.disconnect();
  }, []);
  return [ref, v];
}

function useCounter(target, dur = 1800, go = false) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!go) return; let t0 = null;
    const step = (ts) => { if (!t0) t0 = ts; const p = Math.min((ts - t0) / dur, 1); setV(Math.floor((1 - Math.pow(1 - p, 3)) * target)); if (p < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }, [go, target, dur]);
  return v;
}

// ─── THEME TOGGLE ─────────────────────────────────────────────────────────────
const ThemeIcon = ({ isDark, color }) => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    {isDark ? <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /> : <React.Fragment><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></React.Fragment>}
  </svg>
);

function ThemeToggle({ isDark, onToggle, T }) {
  const [h, setH] = useState(false);
  return (
    <button onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} onClick={onToggle}
      style={{ display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.4rem 0.85rem", borderRadius: 20, border: `1.5px solid ${h ? T.teal : T.border}`, background: isDark ? (h ? "rgba(56,189,248,0.15)" : "rgba(255,255,255,0.08)") : (h ? "rgba(14,165,233,0.08)" : "rgba(0,0,0,0.04)"), cursor: "pointer", transition: "all .22s", fontFamily: T.mono, fontSize: ".65rem", fontWeight: 700, color: h ? T.tealL : T.textMuted, letterSpacing: ".08em", outline: "none", flexShrink: 0 }}>
      <div style={{ width: 36, height: 20, borderRadius: 10, background: isDark ? `linear-gradient(135deg,${T.teal},${T.violetL})` : "#cbd5e1", position: "relative", flexShrink: 0 }}>
        <div style={{ position: "absolute", top: 2, left: isDark ? 18 : 2, width: 16, height: 16, borderRadius: "50%", background: isDark ? "#0f172a" : "#fff", transition: "all .25s", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <ThemeIcon isDark={isDark} color={isDark ? T.tealL : "#64748b"} />
        </div>
      </div>
      <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>{isDark ? "Dark" : "Light"}</Box>
    </button>
  );
}

// ─── SKILL RADAR ─────────────────────────────────────────────────────────────
function SkillRadar({ scores, color, size = 200, T }) {
  const skills = ["SDTM", "ADaM", "SAS", "CDISC", "CDM", "NLP"];
  const N = skills.length; const cx = size / 2, cy = size / 2, R = size * 0.36;
  const pts = scores.map((_, i) => { const a = ((Math.PI * 2) / N) * i - Math.PI / 2; const r = (R * scores[i]) / 100; return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; });
  const d = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ") + "Z";
  const webs = [0.2, 0.4, 0.6, 0.8, 1].map(s => scores.map((_, i) => { const a = ((Math.PI * 2) / N) * i - Math.PI / 2; return [cx + R * s * Math.cos(a), cy + R * s * Math.sin(a)]; }));
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {webs.map((w, i) => (<polygon key={i} points={w.map(p => p.join(",")).join(" ")} fill="none" stroke={`rgba(56,189,248,${0.10 + i * 0.04})`} strokeWidth=".8" />))}
      {skills.map((_, i) => { const a = ((Math.PI * 2) / N) * i - Math.PI / 2; return <line key={i} x1={cx} y1={cy} x2={cx + R * Math.cos(a)} y2={cy + R * Math.sin(a)} stroke="rgba(56,189,248,.18)" strokeWidth=".8" />; })}
      <path d={d} fill={`${color}28`} stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
      {pts.map((p, i) => (<circle key={i} cx={p[0]} cy={p[1]} r="3" fill={color} />))}
      {skills.map((s, i) => { const a = ((Math.PI * 2) / N) * i - Math.PI / 2; const x = cx + (R + 14) * Math.cos(a), y = cy + (R + 14) * Math.sin(a); return <text key={i} x={x} y={y} textAnchor="middle" dominantBaseline="central" fill={T.textPrimary} fontSize={size * 0.041} fontFamily={T.mono} fontWeight="600">{s}</text>; })}
    </svg>
  );
}

// ─── STAGE PANELS ─────────────────────────────────────────────────────────────
function StageCreateJob({ T }) {
  const [typed, setTyped] = useState(""); const [mode, setMode] = useState("advanced");
  const full = mode === "advanced" ? " Statistical Programmer" : "Statistical Programmer";
  useEffect(() => { let i = 0; const t = setInterval(() => { setTyped(full.slice(0, i + 1)); i++; if (i >= full.length) clearInterval(t); }, 60); return () => clearInterval(t); }, [mode, full]);
  const skills = mode === "advanced"
    ? [{ label: "SDTM", w: "Critical", c: T.rose }, { label: "CDISC", w: "Critical", c: T.rose }, { label: "ADaM", w: "Required", c: T.amber }, { label: "SAS", w: "Required", c: T.amber }, { label: "Rave", w: "Preferred", c: T.teal }]
    : [{ label: "SDTM", w: "Good to Have", c: T.teal }, { label: "CDISC", w: "Good to Have", c: T.teal }, { label: "ADaM", w: "Optional", c: T.emerald }, { label: "SAS", w: "Optional", c: T.emerald }, { label: "Rave", w: "Nice to Have", c: T.violetL }];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: ".65rem" }}>
      <div>
        <div style={{ fontSize: ".55rem", color: T.textMuted, fontFamily: T.mono, marginBottom: ".28rem" }}>JOB TITLE</div>
        <div style={{ padding: ".52rem .78rem", background: T.bg1, border: `1px solid ${T.teal}55`, borderRadius: 8, fontSize: ".78rem", color: T.textPrimary, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>{typed}<span style={{ color: T.teal, fontWeight: "bold" }}>|</span></span>
          <div style={{ fontSize: ".52rem", color: T.teal, background: `${T.teal}18`, padding: "2px 6px", borderRadius: "4px", fontWeight: 700 }}>AI</div>
        </div>
      </div>
      <div style={{ display: "flex", gap: ".5rem" }}>
        {["standard", "advanced"].map(m => { const isA = mode === m; const c = m === "advanced" ? T.amber : T.teal; return (<div key={m} onClick={() => setMode(m)} style={{ flex: 1, padding: ".45rem .6rem", borderRadius: 8, cursor: "pointer", textAlign: "center", fontSize: ".6rem", fontWeight: 700, fontFamily: T.mono, background: isA ? `${c}18` : "transparent", border: `1px solid ${isA ? c + "55" : T.border}`, color: isA ? c : T.textMuted }}>{m.toUpperCase()}</div>); })}
      </div>
      <div>
        <div style={{ fontSize: ".55rem", color: T.textMuted, fontFamily: T.mono, marginBottom: ".4rem" }}>REQUIRED SKILLS</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: ".35rem" }}>
          {skills.map(sk => (<span key={sk.label} style={{ fontSize: ".56rem", fontFamily: T.mono, background: `${sk.c}18`, color: sk.c, border: `1px solid ${sk.c}44`, padding: ".18rem .52rem", borderRadius: 6 }}>{sk.label} · {sk.w}</span>))}
        </div>
      </div>
      <div style={{ padding: ".55rem .72rem", background: T.tealBg, border: `1px solid ${T.tealBd}`, borderRadius: 8, display: "flex", alignItems: "center", gap: ".6rem", fontSize: ".62rem", color: T.teal }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8" /><rect width="16" height="12" x="4" y="8" rx="2" /><path d="M2 14h2M20 14h2M15 13v2M9 13v2" /></svg>
        <span style={{ fontWeight: 500 }}>AI auto-extracted skills based on selected mode</span>
      </div>
    </div>
  );
}
function StageMatched({ T }) {
  const candidates = [
    { name: "John D.", score: 94, radar: [92, 87, 78, 91, 85, 75], color: T.emerald, skills: ["SDTM", "CDISC", "ADaM"] },
    { name: "Belly K.", score: 92, radar: [76, 68, 75, 72, 88, 60], color: T.teal, skills: ["CDISC", "Rave", "SAS"] },
    { name: "Priya S.", score: 92, radar: [78, 91, 95, 75, 80, 79], color: T.amber, skills: ["SAS", "ADaM", "NLP"] },
  ];
  const [active, setActive] = useState(0);
  useEffect(() => { const t = setInterval(() => setActive((a) => (a + 1) % candidates.length), 2400); return () => clearInterval(t); }, []);
  const ac = candidates[active];

  return (
    <Grid container spacing={{ xs: 1.5, sm: 1.5 }}>
      <Grid size={{ xs: 12, sm: 4 }} sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: ".25rem" }}>
        <SkillRadar key={active} scores={ac.radar} color={ac.color} size={162} T={T} />
        <div style={{ fontSize: ".52rem", color: T.textMuted, fontFamily: T.mono, textAlign: "center" }}>{ac.name} · Skill Radar</div>
      </Grid>
      <Grid size={{ xs: 12, sm: 8 }} sx={{ display: "flex", flexDirection: "column", gap: ".42rem" }}>
        <div style={{ fontSize: ".55rem", color: T.textMuted, fontFamily: T.mono }}>AI MATCHED — 3 of 12 candidates</div>
        {candidates.map((c, i) => (
          <div key={i} onClick={() => setActive(i)} style={{ display: "flex", alignItems: "center", gap: ".55rem", padding: ".52rem .65rem", background: active === i ? `${c.color}12` : T.candidateRowBg, borderRadius: 9, border: `1px solid ${active === i ? c.color + "55" : T.border}`, cursor: "pointer" }}>
            <div style={{ width: 26, height: 26, borderRadius: "50%", background: `${c.color}25`, border: `1.5px solid ${c.color}66`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><span style={{ fontSize: ".62rem", fontWeight: 800, color: c.color, fontFamily: T.mono }}>{c.name[0]}</span></div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: T.sans, fontSize: ".72rem", fontWeight: 700, color: T.textPrimary }}>{c.name}</div>
              <div style={{ display: "flex", gap: ".2rem", flexWrap: "wrap" }}>{c.skills.map((sk) => (<span key={sk} style={{ fontSize: ".46rem", fontFamily: T.mono, background: `${c.color}18`, color: c.color, border: `1px solid ${c.color}44`, padding: ".05rem .28rem", borderRadius: 8 }}>{sk}</span>))}</div>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div style={{ fontSize: ".95rem", fontWeight: 800, color: c.color, fontFamily: T.sans, lineHeight: 1 }}>{c.score}</div>
              <div style={{ fontSize: ".42rem", color: T.textMuted, fontFamily: T.mono }}>match</div>
            </div>
          </div>
        ))}
        {["SDTM", "ADaM", "SAS"].map((sk, i) => (
          <div key={sk}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: ".08rem" }}><span style={{ fontSize: ".5rem", color: T.textMuted, fontFamily: T.mono }}>{sk}</span><span style={{ fontSize: ".5rem", color: ac.color, fontFamily: T.mono }}>{ac.radar[i]}%</span></div>
            <div style={{ height: 3, background: T.skillTrack, borderRadius: 4, overflow: "hidden" }}><div style={{ height: "100%", borderRadius: 4, background: `linear-gradient(90deg,${ac.color},${ac.color}88)`, width: `${ac.radar[i]}%` }} /></div>
          </div>
        ))}
      </Grid>
    </Grid>
  );
}

function StageInterview({ T }) {
  const slots = [
    { name: "John D.", date: "Mon, Jan 13", time: "10:00 AM", type: "Technical Round", status: "confirmed", color: T.emerald },
    { name: "Belly K.", date: "Tue, Jan 14", time: "2:30 PM", type: "HR Round", status: "pending", color: T.amber },
    { name: "Priya S.", date: "Wed, Jan 15", time: "11:00 AM", type: "Final Round", status: "confirmed", color: T.teal },
  ];
  const [pulse, setPulse] = useState(0);
  useEffect(() => { const t = setInterval(() => setPulse(p => (p + 1) % slots.length), 4800); return () => clearInterval(t); }, []);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: ".6rem" }}>
      <div style={{ fontSize: ".55rem", color: T.textMuted, fontFamily: T.mono }}>INTERVIEW SCHEDULE — 3 SHORTLISTED</div>
      {slots.map((s, i) => (
        <div key={i} style={{ display: "flex", gap: ".65rem", padding: ".58rem .72rem", background: pulse === i ? `${s.color}10` : T.candidateRowBg, borderRadius: 9, border: `1px solid ${pulse === i ? s.color + "55" : T.border}`, alignItems: "center" }}>
          <div style={{ width: 36, height: 36, borderRadius: 9, background: `${s.color}20`, border: `1px solid ${s.color}44`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <div style={{ fontSize: ".44rem", color: s.color, fontFamily: T.mono, fontWeight: 700 }}>{s.date.split(" ")[0].toUpperCase()}</div>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: ".4rem" }}>
              <span style={{ fontFamily: T.sans, fontSize: ".74rem", fontWeight: 700, color: T.textPrimary }}>{s.name}</span>
              <span style={{ fontSize: ".5rem", fontFamily: T.mono, background: s.status === "confirmed" ? T.emeraldBg : T.amberBg, color: s.status === "confirmed" ? T.emeraldL : T.amberL, border: `1px solid ${s.status === "confirmed" ? T.emeraldBd : T.amberBd}`, padding: ".06rem .38rem", borderRadius: 10 }}>{s.status === "confirmed" ? "✓ Confirmed" : "⏳ Pending"}</span>
            </div>
            <div style={{ fontSize: ".6rem", color: T.textMuted, fontFamily: T.mono }}>{s.type} · {s.date} · {s.time}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function StageOffer({ T }) {
  const [count, setCount] = useState(0);
  useEffect(() => { let i = 0; const t = setInterval(() => { i += 2; setCount(Math.min(i, 100)); if (i >= 100) clearInterval(t); }, 22); return () => clearInterval(t); }, []);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: ".65rem" }}>
      <div style={{ padding: "1rem", background: `${T.emerald}12`, border: `1px solid ${T.emerald}55`, borderRadius: 12, display: "flex", gap: ".85rem", alignItems: "center" }}>
        <div style={{ width: 48, height: 48, borderRadius: "50%", background: `${T.emerald}25`, border: `2px solid ${T.emerald}77`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><span style={{ fontSize: "1.2rem", fontWeight: 900, color: T.emerald, fontFamily: T.mono }}>S</span></div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: T.sans, fontSize: ".86rem", fontWeight: 800, color: T.textPrimary }}>John D.</div>
          <div style={{ fontSize: ".62rem", color: T.textMuted, fontFamily: T.mono }}>Statistical Programmer · Selected</div>
          <div style={{ display: "flex", gap: ".25rem", marginTop: ".28rem" }}>{["SDTM", "CDISC", "ADaM"].map(sk => (<span key={sk} style={{ fontSize: ".5rem", fontFamily: T.mono, background: T.emeraldBg, color: T.emeraldL, border: `1px solid ${T.emeraldBd}`, padding: ".08rem .34rem", borderRadius: 10 }}>{sk}</span>))}</div>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}><div style={{ fontSize: "1.6rem", fontWeight: 900, color: T.emerald }}>{count >= 100 ? "✓" : count}</div><div style={{ fontSize: ".48rem", color: T.textMuted, fontFamily: T.mono }}>Skill Score</div></div>
      </div>
      <div style={{ height: 6, background: T.skillTrack, borderRadius: 6, overflow: "hidden" }}><div style={{ height: "100%", borderRadius: 6, background: `linear-gradient(90deg,${T.teal},${T.emerald})`, width: `${count}%`, transition: "width .1s linear" }} /></div>
      {[{ label: "Offer letter generated", done: true }, { label: "Background check initiated", done: true }, { label: "Onboarding docs sent", done: true }, { label: "Start date confirmed — Jan 20", done: count >= 100 }].map((item, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: ".55rem", padding: ".42rem .62rem", background: item.done ? `${T.emerald}0a` : T.candidateRowBg, border: `1px solid ${item.done ? T.emerald + "44" : T.border}`, borderRadius: 8 }}>
          <div style={{ width: 16, height: 16, borderRadius: "50%", background: item.done ? `${T.emerald}25` : "transparent", border: `1.5px solid ${item.done ? T.emerald : T.textMuted + "44"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{item.done && <span style={{ fontSize: ".52rem", color: T.emerald }}>✓</span>}</div>
          <span style={{ fontSize: ".68rem", fontFamily: T.sans, color: item.done ? T.textPrimary : T.textMuted }}>{item.label}</span>
        </div>
      ))}
    </div>
  );
}

const DashboardIcon = ({ type, color, size = 12 }) => {
  const icons = {
    shortlist: <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />,
    reject: <path d="M18 6 6 18M6 6l12 12" />,
    interview: <React.Fragment><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></React.Fragment>,
    offer: <React.Fragment><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></React.Fragment>,
    onboard: <React.Fragment><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><polyline points="16 11 18 13 22 9" /></React.Fragment>,
    ai: <React.Fragment><rect width="18" height="10" x="3" y="11" rx="2" /><circle cx="12" cy="5" r="2" /><path d="M12 7v4M8 16v.01M16 16v.01" /></React.Fragment>,
    check: <polyline points="20 6 9 17 4 12" />,
  };
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">{icons[type] || null}</svg>);
};

function DonutChart({ data, size = 80, T }) {
  const total = data.reduce((a, b) => a + b.value, 0); let offset = 0;
  const r = size * 0.36, cx = size / 2, cy = size / 2, circ = 2 * Math.PI * r;
  const slices = data.map(d => { const dash = (d.value / total) * circ; const s = { ...d, dash, gap: circ - dash, offset }; offset += dash; return s; });
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={T.border} strokeWidth={size * 0.14} />
      {slices.map((s, i) => (<circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={s.color} strokeWidth={size * 0.14} strokeDasharray={`${s.dash} ${s.gap}`} strokeDashoffset={-s.offset} />))}
    </svg>
  );
}

function StageDashboard({ T }) {
  const pipeline = [{ label: "Applied", value: 47, color: T.teal }, { label: "Shortlisted", value: 18, color: T.violetL }, { label: "Interview", value: 9, color: T.amber }, { label: "Offered", value: 3, color: T.emerald }, { label: "Rejected", value: 17, color: T.rose }];
  const donutData = [{ value: 18, color: T.violetL }, { value: 9, color: T.amber }, { value: 3, color: T.emerald }, { value: 17, color: T.rose }, { value: 13, color: T.teal }];
  const metrics = [{ label: "Shortlisted", value: "18", sub: "of 47 applied", color: T.violetL, icon: "shortlist" }, { label: "Rejected", value: "17", sub: "36% drop-off", color: T.rose, icon: "reject" }, { label: "Interviews", value: "9", sub: "scheduled", color: T.teal, icon: "interview" }, { label: "Offers Out", value: "3", sub: "awaiting reply", color: T.emeraldL, icon: "offer" }, { label: "OnBoarded", value: "2", sub: "recently onboarded", color: T.textMuted, icon: "onboard" }];
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
      <Grid container spacing={0.6} sx={{ mb: 1 }}>
        {metrics.map((m, i) => (
          <Grid key={i} size={{ xs: 6, sm: 4 }}>
            <div style={{ padding: ".55rem .65rem", background: T.stageItem, border: `1px solid ${T.border}`, borderRadius: 10, borderLeft: `3px solid ${m.color}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}><span style={{ fontSize: ".68rem", color: T.textMuted, fontFamily: T.mono }}>{m.label}</span><DashboardIcon type={m.icon} color={m.color} size={11} /></div>
              <div style={{ fontSize: "1.15rem", fontWeight: 800, color: m.color, fontFamily: T.sans }}>{m.value}</div>
              <div style={{ fontSize: ".63rem", color: T.textMuted, fontFamily: T.sans }}>{m.sub}</div>
            </div>
          </Grid>
        ))}
      </Grid>
      <div style={{ display: "flex", gap: ".8rem", padding: ".7rem", background: T.stageItem, border: `1px solid ${T.border}`, borderRadius: 12 }}>
        <div style={{ flexShrink: 0 }}><DonutChart data={donutData} size={72} T={T} /></div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: ".35rem", justifyContent: "center" }}>
          {pipeline.map((p, i) => (<div key={i}><div style={{ display: "flex", justifyContent: "space-between", fontSize: ".62rem", marginBottom: 4 }}><span style={{ color: T.textPrimary }}>{p.label}</span><span style={{ color: p.color, fontWeight: 700 }}>{p.value}</span></div><div style={{ height: 4, background: T.progressTrack, borderRadius: 4, overflow: "hidden" }}><div style={{ height: "100%", background: `linear-gradient(90deg,${p.color},${p.color}aa)`, width: `${(p.value / 47) * 100}%` }} /></div></div>))}
        </div>
      </div>
    </Box>
  );
}

const PlatformTabIcon = ({ type, color, size = 16 }) => {
  const icons = {
    dashboard: <React.Fragment><rect width="7" height="11" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" /></React.Fragment>,
    create: <React.Fragment><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></React.Fragment>,
    ai: <React.Fragment><path d="M12 8V4H8" /><rect width="16" height="12" x="4" y="8" rx="2" /><path d="M2 14h2M20 14h2M15 13v2M9 13v2" /></React.Fragment>,
    interview: <React.Fragment><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></React.Fragment>,
    offer: <path d="m22 2-7 20-4-9-9-4Z" />,
  };
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">{icons[type] || null}</svg>);
};

function PlatformPreviewCard({ T }) {
  const tabs = [
    { label: "Dashboard", iconKey: "dashboard", color: T.emerald },
    { label: "Create Job", iconKey: "create", color: T.teal },
    { label: "AI Matched", iconKey: "ai", color: T.violetL },
    { label: "Interview", iconKey: "interview", color: T.amber },
    { label: "Offer", iconKey: "offer", color: T.emerald },
  ];
  const [active, setActive] = useState(0);
  useEffect(() => { const t = setInterval(() => { setActive(prev => (prev === 0 ? 1 : (prev % 4) + 1)); }, 10000); return () => clearInterval(t); }, []);
  return (
    <GCard T={T} glow={T.teal} style={{ padding: "1.5rem" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.2rem" }}>
        <div>
          <div style={{ fontFamily: T.sans, fontWeight: 800, color: T.textPrimary, fontSize: ".92rem" }}>Ri8Fit Platform</div>
          <div style={{ fontSize: ".65rem", color: T.textMuted, fontFamily: T.mono }}>ATS · AI Matching · SkillIntel</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: ".4rem" }}><div style={{ width: 7, height: 7, borderRadius: "50%", background: T.emerald, animation: "ri8Pulse 1.8s infinite" }} /><span style={{ fontSize: ".52rem", color: T.emeraldL, fontFamily: T.mono, fontWeight: 600 }}>LIVE</span></div>
      </div>
      {/* Tab bar */}
      <Grid container sx={{ background: T.bg2, border: `1px solid ${T.border}`, borderRadius: "12px", p: "6px", mb: "1.4rem" }} spacing={0.5}>
        {tabs.map((tab, i) => {
          const isActive = active === i;
          return (
            <Grid key={i} size={{ xs: 12 / tabs.length, sm: 12 / tabs.length }}>              <Box component="button" onClick={() => setActive(i)}
              sx={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", py: "6px", px: "2px", borderRadius: "10px", border: "none", cursor: "pointer", background: isActive ? `${tab.color}18` : "transparent", outline: isActive ? `1px solid ${tab.color}55` : "none" }}>
              <PlatformTabIcon type={tab.iconKey} color={isActive ? tab.color : T.textMuted} size={15} />
              <Box component="span" sx={{ fontSize: ".5rem", fontFamily: T.mono, fontWeight: 700, color: isActive ? tab.color : T.textMuted, textTransform: "uppercase", letterSpacing: ".06em", display: { xs: "none", sm: "block" } }}>{tab.label}</Box>
            </Box>
            </Grid>
          );
        })}
      </Grid>
      {/* Stage content */}
      <div style={{
        background: T.stageBg,
        borderRadius: 14,
        border: `1px solid ${T.border}`,
        height: 320,
        overflow: "hidden",
        marginBottom: "1rem",
        flexShrink: 0,
      }}>
        <div key={active} style={{ height: "100%", overflowY: "auto", padding: "1.25rem", scrollbarWidth: "thin", scrollbarColor: `${T.teal}66 transparent` }}>
          {active === 0 && <StageDashboard T={T} />}
          {active === 1 && <StageCreateJob T={T} />}
          {active === 2 && <StageMatched T={T} />}
          {active === 3 && <StageInterview T={T} />}
          {active === 4 && <StageOffer T={T} />}
        </div>
      </div>
      <LiveFeed T={T} />
    </GCard>
  );
}

function LiveFeed({ T }) {
  const events = ["✓ Clinical Data Manager shortlisted — Mumbai", "⚡ 5 candidates AI-scored for open role", "✓ Interview scheduled — Rave Programmer", "⚡ Skill match report generated", "✓ Offer stage reached — Biostatistician", "✓ New job created — Clinical PM"];
  const [fi, setFi] = useState(0); const [ff, setFf] = useState(true);
  useEffect(() => { const t = setInterval(() => { setFf(false); setTimeout(() => { setFi(i => (i + 1) % events.length); setFf(true); }, 280); }, 2700); return () => clearInterval(t); }, []);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: ".55rem", padding: ".58rem .85rem", background: T.feedBg, borderRadius: 8, border: `1px solid ${T.border}` }}>
      <div style={{ width: 6, height: 6, borderRadius: "50%", background: T.emerald, flexShrink: 0, animation: "ri8Pulse 1.5s ease-in-out infinite" }} />
      <span style={{ fontSize: ".64rem", fontFamily: T.mono, color: T.textPrimary, opacity: ff ? 1 : 0, transition: "opacity .28s", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{events[fi]}</span>
    </div>
  );
}

// ─── VALUE POINTS FLASHER ────────────────────────────────────────────────────
function ValueFlasher({ T }) {
  const points = [
    { icon: <SpeedIcon fontSize="inherit" />, text: "Pre-assessed, role-ready talent" },
    { icon: <TrackChangesIcon fontSize="inherit" />, text: "AI-driven skill matching & validation" },
    { icon: <BoltIcon fontSize="inherit" />, text: "Faster hiring cycles with reduced overhead" },
    { icon: <BiotechIcon fontSize="inherit" />, text: "Built for life sciences, biotech & healthcare" },
  ];
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => { setIdx((i) => (i + 1) % points.length); setVisible(true); }, 300);
    }, 2800);
    return () => clearInterval(interval);
  }, [points.length]);

  const p = points[idx];

  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: ".6rem",
        padding: { xs: ".4rem .85rem", sm: ".42rem 1.1rem" },
        background: T.tealBg,
        border: `1px solid ${T.tealBd}`,
        borderRadius: 9999,
        width: { xs: "100%", sm: "auto" },
        maxWidth: { xs: "100%", sm: 420 },
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(6px)",
        transition: "opacity .3s ease, transform .3s ease",
      }}
    >
      <Box component="span" sx={{ display: "flex", alignItems: "center", fontSize: "1.1rem", color: T.tealL, flexShrink: 0 }}>
        {p.icon}
      </Box>
      <Box
        component="span"
        sx={{
          fontSize: { xs: ".66rem", sm: ".72rem" },
          fontFamily: T.mono,
          color: T.tealL,
          fontWeight: 600,
          lineHeight: 1.35,
          minWidth: 0,
          overflowWrap: "break-word",
        }}
      >
        {p.text}
      </Box>
    </Box>
  );
}
// ─── STAT STRIP ───────────────────────────────────────────────────────────────
function StatStrip({ T }) {
  const [ref, iv] = useInView(0.22); const [go, setGo] = useState(false);
  useEffect(() => { if (iv) setGo(true); }, [iv]);
  const v1 = useCounter(10000, 1900, go); const v2 = useCounter(3, 1600, go); const v3 = useCounter(50, 2100, go);
  const stats = [
    { val: `${v1.toLocaleString()}+`, label: "Candidates Database", color: T.tealL },
    { val: `${v2} Days`, label: "Avg Time to Hire", color: T.amberL },
    { val: `${v3}%`, label: "Cost to Hire Savings", color: T.emeraldL },
    { val: "2", label: "Hiring Modes", color: T.violetL },
  ];
  return (
    <Box ref={ref} sx={{ mt: { xs: 2.5, md: 4.5 }, background: T.bgGlass, border: `1px solid ${T.border}`, borderRadius: "18px", backdropFilter: "blur(20px)", overflow: "hidden", boxShadow: T === DARK ? "0 10px 40px rgba(0,0,0,0.5)" : "0 10px 35px rgba(0,0,0,0.06)" }}>
      <Grid container>
        {stats.map((s, i) => (
          <Grid key={i} size={{ xs: 6, md: 3 }}>
            <Box sx={{ textAlign: "center", py: { xs: "1.4rem", md: "2.1rem" }, px: { xs: ".8rem", md: "1.2rem" }, borderRight: { xs: i % 2 === 0 ? `1px solid ${T.border}` : "none", md: i < 3 ? `1px solid ${T.border}` : "none" }, borderTop: { xs: i >= 2 ? `1px solid ${T.border}` : "none", md: "none" } }}>
              <div style={{ fontSize: "clamp(1.6rem,3vw,2.4rem)", fontWeight: 800, lineHeight: 1, marginBottom: ".5rem", color: s.color, fontFamily: T.sans, letterSpacing: "-0.03em" }}>{s.val}</div>
              <div style={{ fontSize: ".69rem", color: T.textPrimary, fontFamily: T.mono, letterSpacing: ".1em", textTransform: "uppercase", fontWeight: 500 }}>{s.label}</div>
              <div style={{ height: 2, width: 28, background: s.color, borderRadius: 2, margin: ".75rem auto 0", opacity: .45 }} />
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

// ─── NAV ──────────────────────────────────────────────────────────────────────
function Nav({ go, isDark, onToggleTheme, T }) {
  const [sc, setSc] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  useEffect(() => { const fn = () => setSc(window.scrollY > 38); window.addEventListener("scroll", fn); return () => window.removeEventListener("scroll", fn); }, []);
  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 500, background: sc ? T.navBg : "transparent", backdropFilter: sc ? "blur(24px)" : "none", WebkitBackdropFilter: sc ? "blur(24px)" : "none", borderBottom: sc ? `1px solid ${T.border}` : "1px solid transparent", transition: "all .38s" }}>
      <Grid container alignItems="center" justifyContent="space-between"
        sx={{ maxWidth: 1460, mx: "auto", px: { xs: 1.5, sm: 3, md: 5, lg: 8, xl: 18 }, height: { xs: 60, sm: 72, md: 80, lg: 100 } }}>
        {/* Logo */}
        {/* Logo */}
        <Grid size={{ xs: "auto" }}>
          <div
            onClick={() => go("home")}
            style={{
              width: "140px",
              height: "48px",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <img
              src={isDark ? Ri8fit_Logo2 : Ri8fit_Logo}
              alt="Ri8Fit"
              style={{
                width: "140px",
                height: "48px",
                objectFit: "contain",
                objectPosition: "center",
                display: "block",
              }}
            />
          </div>
        </Grid>
        {/* Desktop actions */}
        <Grid size={{ xs: "auto" }} sx={{ display: { xs: "none", sm: "flex" }, gap: 1, alignItems: "center" }}>
          <ThemeToggle isDark={isDark} onToggle={onToggleTheme} T={T} />
          <OutlineBtn T={T} style={{ padding: ".45rem 1.1rem", fontSize: ".78rem" }} onClick={() => navigate("/for-candidate/candidate-home")}>For Candidates</OutlineBtn>
          <PrimaryBtn T={T} style={{ padding: ".45rem 1.1rem", fontSize: ".78rem" }} onClick={() => navigate("/recruit/login")}>Sign In</PrimaryBtn>
        </Grid>
        {/* Mobile hamburger */}
        <Grid size={{ xs: "auto" }} sx={{ display: { xs: "flex", sm: "none" }, alignItems: "center", gap: 1 }}>
          <ThemeToggle isDark={isDark} onToggle={onToggleTheme} T={T} />
          <Box component="button" onClick={() => setOpen(!open)} sx={{ background: "transparent", border: `1px solid ${T.border}`, borderRadius: "8px", p: "6px 10px", cursor: "pointer", color: T.textPrimary, fontSize: "1.1rem" }}>☰</Box>
        </Grid>
      </Grid>
      {/* Mobile dropdown */}
      {open && (
        <Box sx={{ display: { xs: "flex", sm: "none" }, flexDirection: "column", gap: 1, px: 2, pb: 2, background: T.navBg, borderTop: `1px solid ${T.border}` }}>
          <Box component="button" onClick={() => { navigate("/for-candidate/candidate-home"); setOpen(false); }} style={{ background: "transparent", border: `1px solid ${T.teal}`, borderRadius: 8, padding: ".6rem 1rem", color: T.teal, fontFamily: T.sans, fontWeight: 600, fontSize: ".85rem", cursor: "pointer" }}>For Candidates</Box>
          <Box component="button" onClick={() => { navigate("/recruit/login"); setOpen(false); }} style={{ background: `linear-gradient(135deg,${T.teal},${T.amber})`, border: "none", borderRadius: 8, padding: ".6rem 1rem", color: "#fff", fontFamily: T.sans, fontWeight: 600, fontSize: ".85rem", cursor: "pointer" }}>Sign In</Box>
        </Box>
      )}
    </nav>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────
function Hero({ go, T, isDark }) {
  const navigate = useNavigate();
  const handleBookDemo = () => navigate("/recruit/book-a-demo", { state: { isDark } });

  return (
    <Box
      component="section"
      sx={{
        minHeight: { xs: "auto", md: "100vh" },
        display: "flex",
        alignItems: "center",
        pt: { xs: "90px", sm: "90px", md: "20px", lg: "20px", xl: "40px" },
        pb: { xs: 6, md: 4 },
        position: "relative",
        zIndex: 1,
        marginTop: { xs: 0, md: "20px", xl: "4px" },
      }}
    >
      <Box sx={{ maxWidth: 1260, mx: "auto", width: "100%", px: { xs: 2, sm: 3, md: 5, lg: 8 } }}>
        <Grid container spacing={{ xs: 4, md: 7, lg: 8 }} alignItems="center">
          {/* LEFT */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ animation: "ri8FadeUp .8s ease both" }}>

              {/* Heading */}
              <h1 style={{
                fontFamily: T.sans,
                fontSize: "clamp(2.3rem, 5.5vw, 4.2rem)",
                fontWeight: 800,
                lineHeight: 1.2,
                color: T.textPrimary,
                marginBottom: "1.3rem",
                letterSpacing: "-0.05em",
              }}>
                Hire Smarter<br />
                <span className="ri8-hero-gradient-text">With Clinical Intelligence</span>
              </h1>

              {/* Description */}
              <p style={{
                fontSize: "clamp(0.95rem, 1.5vw, 1.05rem)",
                color: T.textSecond,
                lineHeight: 1.85,
                maxWidth: "540px",
                marginBottom: "1.8rem",
                fontFamily: T.sans,
              }}>
                Ri8Fit is a hiring management platform with a built-in ATS that uses AI-driven skill matching and clinical domain expertise to enable faster, smarter hiring across clinical, IT, and non-IT roles.
              </p>

              {/* Flashing value points */}
              <div style={{ marginBottom: "2rem" }}>
                <ValueFlasher T={T} />
              </div>

              {/* Buttons */}
              <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
                <PrimaryBtn T={T} onClick={handleBookDemo}>Book a Demo →</PrimaryBtn>
                <OutlineBtn T={T} onClick={() => navigate("/recruit/register_form")}>
                  {/* <OutlineBtn T={T} onClick={() => document.getElementById("platform")?.scrollIntoView({ behavior: "smooth" })}> */}
                  Request Talent ↓
                </OutlineBtn>
              </Box>

              {/* Trust points */}
              <Box sx={{ display: "flex", gap: { xs: 2, sm: 3 }, mt: 3.5, flexWrap: "wrap" }}>
                {["Full ATS Included", "AI Skill Matching", "Clinical-Ready"].map((b) => (
                  <div key={b} style={{ display: "flex", alignItems: "center", gap: ".4rem" }}>
                    <span style={{ color: T.emerald, fontSize: ".75rem" }}>✓</span>
                    <span style={{ color: T.textMuted, fontSize: ".69rem", fontFamily: T.mono }}>{b}</span>
                  </div>
                ))}
              </Box>
            </Box>
          </Grid>

          {/* RIGHT */}
          {/* RIGHT */}
          <Grid size={{ xs: 12, md: 6 }} sx={{ display: "block" }}>
            <Box sx={{ animation: "ri8FadeUp .8s ease .2s both", mt: { xs: 3, md: 10 } }}>
              <PlatformPreviewCard T={T} />
            </Box>
          </Grid>
        </Grid>

        <StatStrip T={T} />
      </Box>
    </Box>
  );
}

// ─── TWO MODES ────────────────────────────────────────────────────────────────
const ModeIcon = ({ type, color }) => {
  const icons = {
    standard: <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />,
    advanced: <React.Fragment><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-1.04Z" /><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-1.04Z" /></React.Fragment>,
  };
  return (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{icons[type]}</svg>);
};

function TwoModesSection({ T }) {
  const [ref, iv] = useInView(0.08);
  const modes = [
    { mode: "01", title: "Standard Hiring", icon: "standard", color: T.teal, bg: T.tealBg, bd: T.tealBd, desc: "Easy-to-use, familiar workflow with keyword search and filtering. Works seamlessly across all roles.", features: ["Easy-to-use familiar workflow", "Keyword search & filtering", "Works across all role types", "Instant setup, zero learning curve"], cta: "Get started instantly" },
    { mode: "02", title: "Advanced Skill Intelligence", icon: "advanced", color: T.amber, bg: T.amberBg, bd: T.amberBd, desc: "Mandatory and weighted skill requirements with AI-based scoring. Domain-specific logic for clinical roles.", features: ["Mandatory & weighted skill config", "AI-based candidate scoring", "Domain-specific clinical logic", "Explainable match reasoning"], cta: "Hire with precision" },
  ];
  return (
    <Box component="section" ref={ref} sx={{ py: { xs: 5, md: 8 }, px: { xs: 2, sm: 3, md: 5, lg: 8 }, position: "relative", zIndex: 1 }}>
      <Box sx={{ maxWidth: 1260, mx: "auto" }}>
        <Box sx={{ textAlign: "center", mb: { xs: 4, md: 6 } }}>
          <Chip T={T} color={T.violetL}>Key Differentiator</Chip>
          <h2 style={{ fontFamily: T.sans, fontSize: "clamp(1.9rem,3.8vw,3rem)", fontWeight: 800, color: T.textPrimary, margin: "1rem 0 .9rem", letterSpacing: "-.03em" }}>Built for Every Hiring Need</h2>
          <p style={{ color: T.textSecond, maxWidth: 520, margin: "0 auto", lineHeight: 1.8, fontFamily: T.sans, fontSize: ".92rem" }}>Two powerful modes under one roof — start simple or go deep with clinical precision.</p>
        </Box>
        <Grid container spacing={{ xs: 2, md: 2.5 }}>
          {modes.map((m, idx) => (
            <Grid key={idx} size={{ xs: 12, sm: 6 }}>
              <GCard T={T} glow={m.color} style={{ padding: "2.4rem", opacity: iv ? 1 : 0, transform: iv ? "translateY(0)" : "translateY(28px)", transition: `all .55s cubic-bezier(.4,0,.2,1) ${idx * 0.13}s`, border: `1px solid ${m.color}33` }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1.2rem", marginBottom: "1.8rem" }}>
                  <div style={{ width: 58, height: 58, borderRadius: 16, background: m.bg, border: `1px solid ${m.bd}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><ModeIcon type={m.icon} color={m.color} /></div>
                  <div><div style={{ fontSize: ".6rem", color: m.color, fontFamily: T.mono, letterSpacing: ".15em", textTransform: "uppercase", fontWeight: 800 }}>Mode {m.mode}</div><div style={{ fontFamily: T.sans, fontSize: "1.25rem", fontWeight: 800, color: T.textPrimary }}>{m.title}</div></div>
                </div>
                <p style={{ color: T.textSecond, fontSize: ".92rem", lineHeight: 1.75, marginBottom: "1.8rem", fontFamily: T.sans }}>{m.desc}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: ".75rem", marginBottom: "2rem" }}>
                  {m.features.map((f, i) => (<div key={i} style={{ display: "flex", gap: ".8rem", alignItems: "center" }}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={m.color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><polyline points="20 6 9 17 4 12" /></svg><span style={{ color: T.textPrimary, fontSize: ".85rem", fontFamily: T.sans, fontWeight: 500 }}>{f}</span></div>))}
                </div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: ".6rem", background: m.bg, border: `1px solid ${m.bd}`, borderRadius: 24, padding: ".45rem 1.1rem", fontSize: ".7rem", color: m.color, fontFamily: T.mono, fontWeight: 700 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: m.color, display: "inline-block" }} />
                  {m.cta.toUpperCase()}
                </div>
              </GCard>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}

// ─── CLINICAL SECTION ─────────────────────────────────────────────────────────
const ClinicalBulletIcon = ({ type, color }) => {
  const icons = {
    framework: <React.Fragment><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /><line x1="12" y1="11" x2="12" y2="17" /><line x1="9" y1="14" x2="15" y2="14" /></React.Fragment>,
    weight: <React.Fragment><path d="M12 3v3M7 21h10M12 21V6M3 7l2 2M21 7l-2 2M3 10c0 4 3 7 3 7h12s3-3 3-7H3Z" /></React.Fragment>,
    scoring: <React.Fragment><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></React.Fragment>,
    terminology: <React.Fragment><polyline points="4 7 4 4 20 4 20 7" /><line x1="9" y1="20" x2="15" y2="20" /><line x1="12" y1="4" x2="12" y2="20" /></React.Fragment>,
  };
  return (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{icons[type] || null}</svg>);
};

function ClinicalSection({ T }) {
  const [ref, iv] = useInView(0.1);
  const bullets = [{ icon: "framework", text: "Role-specific skill frameworks for clinical roles" }, { icon: "weight", text: "Experience-based weighting across clinical skills" }, { icon: "scoring", text: "Explainable candidate scoring with full breakdown" }, { icon: "terminology", text: "Handles clinical terminology variations automatically" }];
  const skillBreakdown = [{ skill: "SDTM Programming", score: 93, weight: "Critical" }, { skill: "CDISC Standards", score: 88, weight: "Critical" }, { skill: "ADaM Datasets", score: 82, weight: "Required" }, { skill: "Medidata Rave", score: 85, weight: "Required" }, { skill: "SAS Macros", score: 74, weight: "Preferred" }, { skill: "Regulatory Submissions", score: 68, weight: "Preferred" }];
  return (
    <Box component="section" ref={ref} sx={{ py: { xs: 5, md: 8 }, px: { xs: 2, sm: 3, md: 5, lg: 8 }, position: "relative", zIndex: 1 }}>
      <Box sx={{ maxWidth: 1260, mx: "auto" }}>
        <Grid container spacing={{ xs: 4, md: 8 }} alignItems="center">
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ opacity: iv ? 1 : 0, transform: iv ? "translateY(0)" : "translateY(28px)", transition: "all .65s cubic-bezier(.4,0,.2,1)" }}>
              <Chip T={T} color={T.amber}>Clinical Specialization</Chip>
              <h2 style={{ fontFamily: T.sans, fontSize: "clamp(1.9rem,3.8vw,2.9rem)", fontWeight: 800, color: T.textPrimary, margin: "1rem 0 1.1rem", lineHeight: 1.15, letterSpacing: "-.03em" }}>Purpose-Built for<br /><span style={{ color: T.amberL }}>Clinical Hiring</span></h2>
              <p style={{ color: T.textSecond, lineHeight: 1.85, fontSize: ".94rem", marginBottom: "2rem", fontFamily: T.sans }}>Unlike generic platforms, Ri8Fit understands clinical roles — delivering accurate, domain-aware matching with <strong style={{ color: T.textPrimary }}>94% average match accuracy</strong>.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: ".75rem" }}>
                {bullets.map((b, i) => (<div key={i} style={{ display: "flex", gap: ".95rem", alignItems: "center", padding: ".85rem 1rem", background: T.amberBg, border: `1px solid ${T.amberBd}`, borderRadius: 12 }}><ClinicalBulletIcon type={b.icon} color={T.amber} /><span style={{ color: T.textPrimary, fontSize: ".88rem", fontFamily: T.sans, lineHeight: 1.4 }}>{b.text}</span></div>))}
              </div>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <GCard T={T} glow={T.amber} style={{ padding: "2.2rem", opacity: iv ? 1 : 0, transform: iv ? "translateY(0)" : "translateY(28px)", transition: "all .65s cubic-bezier(.4,0,.2,1) .15s" }}>
              <div style={{ fontSize: ".62rem", color: T.amber, fontFamily: T.mono, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: "1.5rem", opacity: 0.9 }}>Skill Score Breakdown — Statistical Programmer</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                {skillBreakdown.map((item, i) => (
                  <div key={i}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: ".35rem", alignItems: "center" }}>
                      <div style={{ display: "flex", gap: ".5rem", alignItems: "center" }}>
                        <span style={{ fontSize: ".78rem", color: T.textPrimary, fontFamily: T.sans, fontWeight: 500 }}>{item.skill}</span>
                        <span style={{ fontSize: ".52rem", fontFamily: T.mono, fontWeight: 700, background: item.weight === "Critical" ? T.roseBg : item.weight === "Required" ? T.amberBg : T.tealBg, color: item.weight === "Critical" ? T.rose : item.weight === "Required" ? T.amber : T.teal, border: `1px solid ${item.weight === "Critical" ? T.roseBd : item.weight === "Required" ? T.amberBd : T.tealBd}`, padding: ".1rem .45rem", borderRadius: 4 }}>{item.weight.toUpperCase()}</span>
                      </div>
                      <span style={{ fontSize: ".73rem", color: T.amberL, fontFamily: T.mono, fontWeight: 700 }}>{item.score}%</span>
                    </div>
                    <div style={{ height: 6, background: T.skillTrack, borderRadius: 10, overflow: "hidden" }}><div style={{ height: "100%", borderRadius: 10, background: `linear-gradient(90deg,${T.amber},${T.amberL})`, width: `${item.score}%` }} /></div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: "1.8rem", padding: "1rem 1.2rem", background: T.amberBg, border: `1px solid ${T.amberBd}`, borderRadius: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: ".82rem", color: T.textPrimary, fontFamily: T.sans, fontWeight: 600 }}>Overall Skill Match Score</span>
                <span style={{ fontSize: "1.8rem", fontWeight: 800, color: T.amberL, fontFamily: T.sans, lineHeight: 1 }}>91<span style={{ fontSize: "1rem", opacity: 0.6, fontWeight: 400 }}> / 100</span></span>
              </div>
            </GCard>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

// ─── FEATURES SECTION ─────────────────────────────────────────────────────────
const FeatureIcon = ({ type, color }) => {
  const icons = {
    ai: <React.Fragment><path d="M12 8V4H8" /><rect width="16" height="12" x="4" y="8" rx="2" /><path d="M2 14h2M20 14h2M15 13v2M9 13v2" /></React.Fragment>,
    database: <React.Fragment><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" /><path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3" /></React.Fragment>,
    shortlist: <React.Fragment><circle cx="12" cy="12" r="10" /><path d="m16 16-4-4-4 4" /><path d="M12 12V8" /></React.Fragment>,
    calendar: <React.Fragment><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></React.Fragment>,
    sync: <React.Fragment><path d="M21.5 2v6h-6M2.5 22v-6h6M2 12c0-4.4 3.6-8 8-8 3.3 0 6.1 2 7.3 4.9M22 12c0 4.4-3.6 8-8 8-3.3 0-6.1-2-7.3-4.9" /></React.Fragment>,
    shield: <React.Fragment><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></React.Fragment>,
  };
  return (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">{icons[type] || null}</svg>);
};

function FeaturesSection({ T }) {
  const [ref, iv] = useInView(0.08);
  const features = [
    { icon: "ai", title: "AI Skill Matching", desc: "Proprietary algorithms maps candidate competencies against job requirements with explainable scores.", color: T.teal, bg: T.tealBg, bd: T.tealBd },
    { icon: "database", title: "Candidate Sourcing", desc: "Search our internal database or upload new candidates — all managed in one unified pool.", color: T.amber, bg: T.amberBg, bd: T.amberBd },
    { icon: "shortlist", title: "Smart Shortlisting", desc: "Rank and filter candidates automatically based on weighted skill criteria and role fit scores.", color: T.violetL, bg: T.violetBg, bd: T.violetBd },
    { icon: "calendar", title: "Interview Scheduling", desc: "Schedule interviews and collect structured feedback within the same platform.", color: T.emeraldL, bg: T.emeraldBg, bd: T.emeraldBd },
    { icon: "sync", title: "Candidate Lifecycle", desc: "Track every candidate from application through offer with full pipeline visibility.", color: T.tealL, bg: T.tealBg, bd: T.tealBd },
    { icon: "shield", title: "Background Verification", desc: "Seamlessly trigger and track background checks within the hiring workflow.", color: T.amberL, bg: T.amberBg, bd: T.amberBd },
  ];
  return (
    <Box component="section" ref={ref} sx={{ py: { xs: 5, md: 8 }, px: { xs: 2, sm: 3, md: 5, lg: 8 }, position: "relative", zIndex: 1 }}>
      <Box sx={{ maxWidth: 1280, mx: "auto" }}>
        <div style={{ height: 1, background: `linear-gradient(90deg,transparent,${T.border},transparent)`, marginBottom: "5.5rem" }} />
        <Box sx={{ textAlign: "center", mb: { xs: 4, md: 6 } }}>
          <Chip T={T} color={T.tealL}>Platform Capabilities</Chip>
          <h2 style={{ fontFamily: T.sans, fontSize: "clamp(1.9rem,3.8vw,3rem)", fontWeight: 800, color: T.textPrimary, margin: "1rem 0 .9rem", letterSpacing: "-.03em", lineHeight: 1.2 }}>Everything You Need to Hire —<br /><span style={{ color: T.tealL }}>In One Platform</span></h2>
          <p style={{ color: T.textSecond, maxWidth: 520, margin: "0 auto", lineHeight: 1.8, fontFamily: T.sans, fontSize: ".92rem" }}>From sourcing to offer, every step of your hiring process lives in Ri8Fit.</p>
        </Box>
        <Grid container spacing={{ xs: 2, md: 2.5 }}>
          {features.map((f, i) => (
            <Grid key={i} size={{ xs: 12, sm: 6, lg: 4 }}>
              <GCard T={T} glow={f.color} style={{ padding: "2rem", opacity: iv ? 1 : 0, transform: iv ? "translateY(0)" : "translateY(28px)", transition: `all .55s cubic-bezier(.4,0,.2,1) ${i * 0.08}s`, display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.2rem" }}>
                  <div style={{ width: 50, height: 50, borderRadius: 13, background: f.bg, border: `1px solid ${f.bd}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><FeatureIcon type={f.icon} color={f.color} /></div>
                  <h3 style={{ fontFamily: T.sans, fontSize: "1.02rem", fontWeight: 700, color: T.textPrimary, margin: 0, flex: 1 }}>{f.title}</h3>
                </div>
                <p style={{ color: T.textSecond, fontSize: ".84rem", lineHeight: 1.7, fontFamily: T.sans, flexGrow: 1, marginBottom: "1.6rem" }}>{f.desc}</p>
                <div style={{ height: 3, width: "35px", background: `linear-gradient(90deg,${f.color},transparent)`, borderRadius: 2, marginTop: "auto" }} />
              </GCard>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}

// ─── HOW IT WORKS ─────────────────────────────────────────────────────────────
const ProcessIcon = ({ type, color }) => {
  const icons = {
    doc: <g><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /></g>,
    ai: <React.Fragment><path d="M12 8V4H8" /><rect width="16" height="12" x="4" y="8" rx="2" /><path d="M2 14h2M20 14h2M15 13v2M9 13v2" /></React.Fragment>,
    flash: <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />,
    calendar: <React.Fragment><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></React.Fragment>,
    check: <React.Fragment><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></React.Fragment>,
  };
  return (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">{icons[type] || null}</svg>);
};

function HowItWorksSection({ T }) {
  const [ref, iv] = useInView(0.10);
  const steps = [
    { n: "01", title: "Define Job", desc: "Define the role with required skills, experience weights, and hiring criteria in minutes.", icon: "doc", color: T.teal },
    { n: "02", title: "AI Matches & Scores", desc: "Our engine ranks every candidate with explainable skill scores matched to your job requirements.", icon: "ai", color: T.violetL },
    { n: "03", title: "Get Ranked Candidates", desc: "Review ranked candidates, apply filters, and shortlist in one click with confidence.", icon: "flash", color: T.tealL },
    { n: "04", title: "Schedule Interviews", desc: "Book interviews and send invites directly from the platform.", icon: "calendar", color: T.amberL },
    { n: "05", title: "Make Hiring Decision", desc: "Gather structured interviewer feedback and make data-backed hiring decisions.", icon: "check", color: T.emeraldL },
  ];
  return (
    <Box component="section" ref={ref} sx={{ py: { xs: 5, md: 8 }, px: { xs: 2, sm: 3, md: 5, lg: 8 }, position: "relative", zIndex: 1 }}>
      <Box sx={{ maxWidth: 1200, mx: "auto" }}>
        <Box sx={{ textAlign: "center", mb: { xs: 4, md: 6 } }}>
          <Chip T={T} color={T.tealL}>Process</Chip>
          <h2 style={{ fontFamily: T.sans, fontSize: "clamp(1.9rem,3.8vw,2.9rem)", fontWeight: 800, color: T.textPrimary, margin: "1rem 0", letterSpacing: "-.03em", lineHeight: 1.2 }}>From Resume to Hire — <span style={{ color: T.tealL }}>Seamlessly</span></h2>
          <p style={{ color: T.textSecond, maxWidth: 520, margin: "1rem auto 0", fontSize: "0.95rem", opacity: 0.9 }}>A simple, intelligent 5-step process powered by AI</p>
        </Box>
        <Grid container spacing={{ xs: 2, sm: 2, md: 2 }} sx={{ position: "relative" }}>
          <Box sx={{ position: "absolute", top: 46, left: "10%", right: "10%", height: 3, background: `linear-gradient(90deg,${T.teal}44,${T.violetL}44,${T.tealL}44,${T.amberL}44,${T.emeraldL}44)`, borderRadius: 4, zIndex: 0, display: { xs: "none", md: "block" } }} />
          {steps.map((s, i) => (
            <Grid key={i} size={{ xs: 6, sm: 4, md: 12 / 5 }}>
              <Box sx={{ textAlign: "center", position: "relative", zIndex: 1, opacity: iv ? 1 : 0, transform: iv ? "translateY(0)" : "translateY(30px)", transition: `all .6s cubic-bezier(.4,0,.2,1) ${i * 0.08}s` }}>
                <div style={{ width: 82, height: 82, borderRadius: "50%", margin: "0 auto 1.4rem", background: T.bg2, border: `2.5px solid ${s.color}77`, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
                  <ProcessIcon type={s.icon} color={s.color} />
                  <div style={{ fontSize: ".58rem", fontFamily: T.mono, color: s.color, letterSpacing: ".15em", fontWeight: 800, marginTop: 4 }}>{s.n}</div>
                </div>
                <h3 style={{ fontWeight: 700, color: T.textPrimary, fontSize: ".95rem", marginBottom: ".6rem", fontFamily: T.sans, lineHeight: 1.3 }}>{s.title}</h3>
                <p style={{ color: T.textSecond, fontSize: ".78rem", lineHeight: 1.75, fontFamily: T.sans, maxWidth: "180px", margin: "0 auto", opacity: 0.85 }}>{s.desc}</p>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}

// ─── USE CASES ────────────────────────────────────────────────────────────────
const CaseIcon = ({ type, color }) => {
  const icons = {
    clinical: <React.Fragment><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z" /><path d="M12 5v14M5 12h14" /></React.Fragment>,
    ta: <React.Fragment><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></React.Fragment>,
    enterprise: <React.Fragment><rect width="8" height="18" x="3" y="3" rx="2" /><rect width="8" height="10" x="13" y="11" rx="2" /><path d="M13 6h7M13 2h7" /></React.Fragment>,
  };
  return (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{icons[type]}</svg>);
};

function UseCasesSection({ T }) {
  const [ref, iv] = useInView(0.1);

  const cases = [
    {
      icon: "clinical",
      title: "Clinical GCC Excellence",
      desc: "Purpose-built for clinical and life sciences hiring — enabling precise matching for specialized roles across trials, data management, biostatistics, and pharmacovigilance.",
      color: T.amber,
      bg: T.amberBg,
      bd: T.amberBd,
      tags: ["Clinical", "SAS", "Biostats", "PV", "Regulatory"],
    },
    {
      icon: "enterprise",
      title: "Multi-Function GCC Hiring",
      desc: "Support hiring across IT, non-IT, operations, and shared services within GCCs — all managed through a single unified platform built for scale.",
      color: T.violetL,
      bg: T.violetBg,
      bd: T.violetBd,
      tags: ["IT", "Non-IT", "Ops", "Finance", "Shared Services"],
    },
    {
      icon: "ta",
      title: "Standardized Hiring Across GCCs",
      desc: "Standardize interview workflows, evaluations, and hiring decisions across global teams to ensure consistency, faster decisions, and better hiring outcomes.",
      color: T.teal,
      bg: T.tealBg,
      bd: T.tealBd,
      tags: ["Workflows", "Interviews", "Feedback", "Consistency", "Scale"],
    },
  ];

  return (
    <Box
      component="section"
      ref={ref}
      sx={{
        py: { xs: 4, md: 6 },
        px: { xs: 2, sm: 3, md: 5, lg: 8 },
        position: "relative",
        zIndex: 1,
      }}
    >
      <Box sx={{ maxWidth: 1260, mx: "auto" }}>

        {/* 🔹 Header */}
        <Box sx={{ textAlign: "center", mb: { xs: 4, md: 5 } }}>
          <Chip T={T} color={T.emeraldL}>GCC Hiring Solutions</Chip>

          <h2
            style={{
              fontFamily: T.sans,
              fontSize: "clamp(1.9rem,3.8vw,2.9rem)",
              fontWeight: 800,
              color: T.textPrimary,
              margin: "1rem 0 .9rem",
              letterSpacing: "-.03em",
              lineHeight: 1.2,
            }}
          >
            End-to-End Hiring for
            <br />
            <span style={{ color: T.tealL }}>
              Global Capability Centers
            </span>
          </h2>
        </Box>

        {/* 🔹 Cards */}
        <Grid container spacing={{ xs: 2, md: 2.5 }}>
          {cases.map((c, i) => (
            <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
              <GCard
                T={T}
                glow={c.color}
                style={{
                  padding: "2.2rem",
                  opacity: iv ? 1 : 0,
                  transform: iv ? "translateY(0)" : "translateY(28px)",
                  transition: `all .55s cubic-bezier(.4,0,.2,1) ${i * 0.13
                    }s`,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* Icon + Title */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1.1rem",
                    marginBottom: "1.4rem",
                  }}
                >
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 16,
                      background: c.bg,
                      border: `1px solid ${c.bd}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <CaseIcon type={c.icon} color={c.color} />
                  </div>

                  <h3
                    style={{
                      fontFamily: T.sans,
                      fontSize: "1.22rem",
                      fontWeight: 700,
                      color: T.textPrimary,
                      lineHeight: 1.25,
                      margin: 0,
                      flex: 1,
                    }}
                  >
                    {c.title}
                  </h3>
                </div>

                {/* Description */}
                <p
                  style={{
                    color: T.textSecond,
                    fontSize: ".85rem",
                    lineHeight: 1.7,
                    marginBottom: "1.5rem",
                    fontFamily: T.sans,
                    flexGrow: 1,
                  }}
                >
                  {c.desc}
                </p>

                {/* Tags */}
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: ".4rem",
                    marginBottom: "1.5rem",
                  }}
                >
                  {c.tags.map((t, j) => (
                    <span
                      key={j}
                      style={{
                        fontSize: ".62rem",
                        fontFamily: T.mono,
                        fontWeight: 600,
                        background: c.bg,
                        color: c.color,
                        border: `1px solid ${c.bd}`,
                        padding: ".2rem .6rem",
                        borderRadius: 6,
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* Bottom Accent Line */}
                <div
                  style={{
                    height: 3,
                    width: "40px",
                    background: `linear-gradient(90deg,${c.color},transparent)`,
                    borderRadius: 2,
                  }}
                />
              </GCard>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}

// ─── TRUST BAR ────────────────────────────────────────────────────────────────
function TrustBar({ T }) {
  const orgs = ["Global Capability Centers", "Clinical CROs", "Global Pharma", "Biotech Companies", "MedTech & Devices", "Clinical Trial Sponsors", "Research Institutions"];
  return (
    <Box component="section" sx={{ py: { xs: 4, md: 6 }, px: { xs: 2, sm: 3, md: 5, lg: 8 }, position: "relative", zIndex: 1 }}>
      <Box sx={{ mx: "auto", maxWidth: 1200 }}>
        <div style={{ background: T.bg1, border: `1px solid ${T.border}`, borderRadius: 24, padding: "clamp(1.5rem,4vw,3.5rem) clamp(1rem,3vw,2.8rem)", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 50% 30%,${T.tealGlow},transparent 75%)`, opacity: 0.15, pointerEvents: "none" }} />
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <span style={{ fontSize: ".72rem", color: T.teal, fontFamily: T.mono, letterSpacing: ".16em", textTransform: "uppercase", fontWeight: 700, background: T.tealBg, padding: ".45rem 1.2rem", borderRadius: 30, border: `1px solid ${T.tealBd}` }}>TRUSTED BY</span>
            <div style={{ fontSize: "clamp(1rem,2vw,1.22rem)", color: T.textPrimary, marginTop: "1rem", fontFamily: T.sans, fontWeight: 500 }}>Leading Clinical Teams, CROs & Life Sciences Organizations</div>
          </div>
          <Grid container spacing={{ xs: 1.5, sm: 2 }} justifyContent="center">
            {orgs.map((name, i) => (
              <Grid key={i} size={{ xs: 6, sm: 4, md: 3, lg: "auto" }}>
                <Box
                  sx={{ padding: { xs: ".85rem 1rem", md: "1.35rem 2.4rem" }, background: T.bg2, border: `1px solid ${T.border}`, borderRadius: "16px", textAlign: "center", transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)", fontFamily: T.mono, fontSize: { xs: ".78rem", md: "0.95rem" }, fontWeight: 600, color: T.textPrimary, cursor: "default", "&:hover": { transform: "translateY(-6px)", borderColor: T.teal, boxShadow: `0 15px 35px ${T.tealGlow}` } }}>
                  {name}
                </Box>
              </Grid>
            ))}
          </Grid>
          <div style={{ textAlign: "center", marginTop: "2.5rem", fontSize: "0.82rem", color: T.textMuted, fontFamily: T.mono, display: "flex", alignItems: "center", justifyContent: "center", gap: ".6rem" }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: T.emerald }} />
            And many more leading life sciences organizations
          </div>
        </div>
      </Box>
    </Box>
  );
}

// ─── CTA ─────────────────────────────────────────────────────────────────────
function CTASection({ navigate, T }) {
  const isDark = T === DARK;
  return (
    <Box component="section" sx={{ py: { xs: 5, md: 8 }, px: { xs: 2, sm: 3, md: 5, lg: 8 }, pb: { xs: 6, md: 10 }, position: "relative", zIndex: 1 }}>
      <Box sx={{ maxWidth: 800, mx: "auto", textAlign: "center" }}>
        <Box sx={{ borderRadius: { xs: "16px", md: "26px" }, p: { xs: "2.2rem 1.2rem", sm: "3rem 2rem", md: "4.5rem 3rem" }, position: "relative", overflow: "hidden", background: isDark ? `linear-gradient(135deg,${T.tealBg},${T.amberBg})` : "linear-gradient(145deg,#e0f7fa 0%,#e8f5e9 40%,#fff8e1 100%)", border: `1px solid ${isDark ? T.tealBd : "rgba(14,165,233,0.25)"}`, backdropFilter: "blur(20px)", boxShadow: isDark ? "none" : "0 16px 48px rgba(14,165,233,0.10)" }}>
          <div style={{ position: "absolute", top: -110, left: "50%", transform: "translateX(-50%)", width: 480, height: 280, borderRadius: "50%", background: `radial-gradient(circle,${T.tealGlow},transparent 65%)`, pointerEvents: "none", opacity: isDark ? 1 : 0.5 }} />
          <Chip T={T} style={{ marginBottom: "1.2rem" }}>Get Started</Chip>
          <h2 style={{ fontFamily: T.sans, fontSize: "clamp(1.9rem,3.8vw,2.9rem)", fontWeight: 800, color: T.textPrimary, margin: "1rem 0", letterSpacing: "-.03em", lineHeight: 1.15 }}>
            Ready to Transform<br />
            <span style={{ display: "block", ...(isDark ? { background: `linear-gradient(135deg,${T.tealL},${T.amberL})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" } : { color: "#0284c7" }) }}>Your Hiring?</span>
          </h2>
          <p style={{ color: isDark ? T.textSecond : "#374151", fontSize: ".92rem", lineHeight: 1.82, marginBottom: "2.8rem", fontFamily: T.sans }}>A complete hiring platform — with deep intelligence where it matters most.</p>
          <Grid container spacing={1.5} justifyContent="center" sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, sm: "auto" }}>
              <PrimaryBtn T={T} onClick={() => navigate("/recruit/book-a-demo")} style={{ width: "100%" }}>Book a Demo →</PrimaryBtn>
            </Grid>
            <Grid size={{ xs: 12, sm: "auto" }}>
              <OutlineBtn T={T} onClick={() => navigate("/recruit/register_form")} style={{ width: "100%" }}>Get Started</OutlineBtn>
            </Grid>
          </Grid>
          <Grid container spacing={1} justifyContent="center">
            {["No commitment required", "Free platform demo", "Full ATS included"].map(item => (
              <Grid key={item} size={{ xs: 12, sm: "auto" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: ".38rem" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={isDark ? T.emerald : "#10b981"} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  <span style={{ color: isDark ? T.textMuted : "#475569", fontSize: ".68rem", fontFamily: T.mono }}>{item}</span>
                </div>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function Footer({ T }) {
  return (
    <Box component="footer" sx={{ background: T.bg1, borderTop: `1px solid ${T.border}`, px: { xs: 2, md: 4 }, py: 2, position: "relative", zIndex: 1 }}>
      <Grid container justifyContent="space-between" alignItems="center" spacing={1}>
        <Grid size={{ xs: 12, sm: "auto" }} sx={{ textAlign: { xs: "center", sm: "left" } }}>
          <span style={{ fontSize: ".72rem", color: T.textMuted, fontFamily: T.mono }}>© 2026 Ri8Fit. All Rights Reserved.</span>
        </Grid>
        <Grid size={{ xs: 12, sm: "auto" }} sx={{ display: "flex", justifyContent: { xs: "center", sm: "flex-end" }, alignItems: "center", gap: ".45rem" }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: T.emerald, animation: "ri8Pulse 2s ease-in-out infinite" }} />
          <span style={{ fontSize: ".67rem", color: T.textMuted, fontFamily: T.mono }}>All systems operational</span>
        </Grid>
      </Grid>
    </Box>
  );
}

// ─── LANDING PAGE ─────────────────────────────────────────────────────────────
const Landingpage = () => {
  const [page, setPage] = useState("home");
  const [isDark, setIsDark] = useState(true);
  const T = isDark ? DARK : LIGHT;
  const go = (p) => setPage(p);
  const navigate = useNavigate();

  useEffect(() => { window.scrollTo({ top: 0, left: 0, behavior: "instant" }); }, [page]);
  useEffect(() => { document.body.style.background = T.bg0; document.body.style.color = T.textPrimary; return () => { document.body.style.background = ""; document.body.style.color = ""; }; }, [T]);

  return (
    <div style={{ background: T.bg0, minHeight: "100vh", color: T.textPrimary, overflowX: "hidden", position: "relative", transition: "background .35s, color .35s" }}>
      <style>{GLOBAL_CSS(T)}</style>

      {/* {isDark&&<AuroraCanvas T={T} />} */}
      {/* {isDark&&<ParticleField />} */}
      {isDark && <SceneBG T={T} />}

      <Nav go={go} isDark={isDark} onToggleTheme={() => setIsDark(d => !d)} T={T} />

      {page === "home" && (
        <>
          <Hero go={go} T={T} isDark={isDark} />
          <TrustBar T={T} />
          <HowItWorksSection T={T} />
          {/* ProblemSection REMOVED as requested */}
          <TwoModesSection T={T} />
          <ClinicalSection T={T} />
          <div id="platform"><FeaturesSection T={T} /></div>
          <UseCasesSection T={T} />
          <CTASection navigate={navigate} T={T} />
        </>
      )}

      {page === "Pricing" && (
        <Box sx={{ pt: "14rem", textAlign: "center", position: "relative", zIndex: 1, px: 2 }}>
          <Chip T={T} color={T.tealL}>Pricing</Chip>
          <h2 style={{ fontFamily: T.sans, fontSize: "2.4rem", color: T.textPrimary, margin: "1.4rem 0 .9rem", fontWeight: 800 }}>Coming Soon</h2>
          <p style={{ color: T.textSecond, fontFamily: T.sans }}>Contact us for enterprise pricing.</p>
        </Box>
      )}

      <Footer T={T} />
      <LandingGuide T={T} navigate={navigate} />
    </div>
  );
};

export default Landingpage;
