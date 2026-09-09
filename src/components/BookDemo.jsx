import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { sendDemoRequest } from "../actions/bookDemo";

const T = {
  bg0: "#0f172a",
  bg1: "#111827",
  bg2: "#1f2937",
  border: "#1f2937",
  teal: "#3b82f6",
  tealL: "#60a5fa",
  amber: "#14b8a6",
  textPrimary: "#f9fafb",
  textSecond: "#9ca3af",
  textMuted: "#6b7280",
  sans: "'Inter', 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif",
  mono: "'JetBrains Mono', monospace",
};
const LIGHT = {
  // Backgrounds
  bg0: "#ffffff",
  bg1: "#f8fafc",
  bg2: "#f1f5f9",
  bgGlass: "rgba(255,255,255,0.96)",

  // Borders
  border: "#e2e8f0",
  borderM: "#cbd5e1",

  // Brand Colors (kept soft for light mode)
  teal: "#0ea5e9",
  tealL: "#38bdf8",
  tealD: "#0369a1",
  tealGlow: "rgba(14,165,233,0.20)",
  tealBg: "rgba(14,165,233,0.07)",
  tealBd: "rgba(14,165,233,0.22)",

  amber: "#0f766e", // Darker base amber (teal-green)
  amberL: "#14b8a6", // ← Changed: Softer, more elegant light amber
  amberD: "#0f766e",
  amberBg: "rgba(20,184,166,0.07)",
  amberBd: "rgba(20,184,166,0.22)",

  emerald: "#10b981",
  emeraldL: "#34d399",
  emeraldBg: "rgba(16,185,129,0.07)",
  emeraldBd: "rgba(16,185,129,0.22)",

  violet: "#8b5cf6",
  violetL: "#a78bfa",
  violetBg: "rgba(139,92,246,0.07)",
  violetBd: "rgba(139,92,246,0.22)",

  rose: "#f43f5e",
  roseBg: "rgba(244,63,94,0.07)",
  roseBd: "rgba(244,63,94,0.22)",

  // Text Colors - FIXED for Light Mode
  textPrimary: "#0f172a", // Deep dark for headings (good)
  textSecond: "#1e2937", // ← Darker secondary text (better body readability)
  textMuted: "#475569", // ← NEW: Much thicker, cleaner muted gray (Slate-600)
  textInvert: "#ffffff",

  // Typography
  sans: "'Inter','Poppins',-apple-system,BlinkMacSystemFont,sans-serif",
  mono: "'JetBrains Mono',monospace",

  // Background Effects (very subtle)
  waveAlpha: [0.05, 0.035, 0.025, 0.018],
  blobAlpha: [".04", ".032", ".025", ".018"],

  // Component Surfaces
  navBg: "rgba(255,255,255,0.98)",
  stageBg: "#f8fafc",
  feedBg: "rgba(14,165,233,0.05)",
  stepBg: "#ffffff",
  skillTrack: "rgba(0,0,0,0.06)",
  statBg: "rgba(255,255,255,0.98)",
  candidateRowBg: "rgba(0,0,0,0.018)",
  shortlistBg: "#f8fafc",
  offerProgressBg: "#f8fafc",

  // Extra
  stageItem: "#ffffff",
  progressTrack: "rgba(0,0,0,0.06)",
};

const DARK = {
  bg0: "#060b14",
  bg1: "#0b1220",
  bg2: "#111927",
  bgGlass: "rgba(11,18,32,0.78)",
  border: "rgba(255,255,255,0.07)",
  borderM: "rgba(255,255,255,0.13)",
  teal: "#0ea5e9",
  tealL: "#38bdf8",
  tealD: "#0369a1",
  tealGlow: "rgba(14,165,233,0.35)",
  tealBg: "rgba(14,165,233,0.10)",
  tealBd: "rgba(14,165,233,0.28)",
  amber: "#14b8a6",
  amberL: "#2dd4bf",
  amberD: "#0f766e",
  amberBg: "rgba(20,184,166,0.10)",
  amberBd: "rgba(20,184,166,0.28)",
  emerald: "#10b981",
  emeraldL: "#34d399",
  emeraldBg: "rgba(16,185,129,0.10)",
  emeraldBd: "rgba(16,185,129,0.28)",
  violet: "#8b5cf6",
  violetL: "#a78bfa",
  violetBg: "rgba(139,92,246,0.10)",
  violetBd: "rgba(139,92,246,0.28)",
  rose: "#f43f5e",
  roseBg: "rgba(244,63,94,0.10)",
  roseBd: "rgba(244,63,94,0.28)",
  textPrimary: "#f0f6ff",
  textSecond: "#94a3b8",
  textMuted: "#64748b",
  textInvert: "#ffffff",
  sans: "'Inter','Poppins',-apple-system,BlinkMacSystemFont,sans-serif",
  mono: "'JetBrains Mono',monospace",
  waveAlpha: [0.18, 0.13, 0.11, 0.09],
  blobAlpha: [".18", ".14", ".12", ".10"],
  navBg: "rgba(6,11,20,0.92)",
  stageBg: "rgba(14,165,233,0.04)",
  feedBg: "rgba(14,165,233,0.07)",
  stepBg: "rgba(255,255,255,0.025)",
  skillTrack: "rgba(255,255,255,0.05)",
  statBg: "rgba(11,18,32,0.78)",
  candidateRowBg: "rgba(255,255,255,0.025)",
  shortlistBg: "rgba(255,255,255,0.025)",
  offerProgressBg: "rgba(255,255,255,0.025)",
};
export default function BookDemo() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    countryCode: "+91",
    phone: "",
    company: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const prefilledEmail = location.state?.email || "";
  const isDark = location.state?.isDark
  const T = isDark ? DARK : LIGHT;
  useEffect(() => {
    if (prefilledEmail) {
      setFormData(prev => ({ ...prev, email: prefilledEmail }));
    }
  }, [prefilledEmail]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const handleCountryChange = (e) => {
    setFormData({ ...formData, countryCode: e.target.value });
  };

  const validate = () => {
    let tempErrors = {};
    tempErrors.name = formData.name.trim() ? "" : "Name is required";
    tempErrors.email = /.+@.+\..+/.test(formData.email) ? "" : "Enter a valid email";

    const fullPhone = (formData.countryCode + formData.phone).replace(/\s+/g, "");
    tempErrors.phone = fullPhone.length > 8 ? "" : "Enter a valid phone number";

    tempErrors.company = formData.company.trim() ? "" : "Company name is required";

    setErrors(tempErrors);
    return Object.values(tempErrors).every((x) => x === "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone_number: (formData.countryCode + formData.phone).replace(/\s+/g, ""),
      company_name: formData.company.trim(),
      message: formData.message.trim() || "",
    };
    // console.log("Payload:", payload);
    try {
      setLoading(true);
      await sendDemoRequest(payload);
      navigate("/success", {
        state: { successMessage: "Your demo request has been submitted successfully!" }
      });
    } catch (error) {
      console.error("Error:", error);
      alert("You already requested for a demo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: T.bg0,
      color: T.textPrimary,
      padding: "1.5rem 1rem",           // Reduced padding
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <div style={{
        maxWidth: "620px",
        width: "100%",
        margin: "0 auto"
      }}>
        {/* Compact Header */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1 style={{
            fontSize: "clamp(2rem, 5.5vw, 2.8rem)",
            fontWeight: 800,
            lineHeight: 1.1,
            marginBottom: "0.6rem"
          }}>
            Book a Demo
          </h1>
          <p style={{
            color: T.textSecond,
            fontSize: "1rem",
            maxWidth: "420px",
            margin: "0 auto"
          }}>
            Our team will contact you shortly after submission.
          </p>
        </div>

        {/* Compact Form Card */}
        <div style={{
          background: T.bg1,
          border: `1px solid ${T.border}`,
          borderRadius: 20,
          padding: "2rem 1.8rem",        // Reduced padding
          // boxShadow: "0 15px 40px rgba(0,0,0,0.25)",
        }}>
          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gap: "1.4rem" }}>   {/* Tighter gap */}

              {/* Name */}
              <div>
                <label style={{ display: "block", marginBottom: "6px", fontSize: "0.82rem", color: T.textMuted, fontFamily: T.mono }}>
                  FULL NAME *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  style={{
                    width: "100%",
                    padding: "13px 15px",
                    background: T.bg2,
                    border: errors.name ? "1px solid #f43f5e" : `1px solid ${T.border}`,
                    borderRadius: 10,
                    color: T.textPrimary,
                    fontSize: "1rem",
                    outline: "none"
                  }}
                />
                {errors.name && <p style={{ color: "#f43f5e", fontSize: "0.78rem", marginTop: "5px" }}>{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label style={{ display: "block", marginBottom: "6px", fontSize: "0.82rem", color: T.textMuted, fontFamily: T.mono }}>
                  WORK EMAIL *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@company.com"
                  style={{
                    width: "100%",
                    padding: "13px 15px",
                    background: T.bg2,
                    border: errors.email ? "1px solid #f43f5e" : `1px solid ${T.border}`,
                    borderRadius: 10,
                    color: T.textPrimary,
                    fontSize: "1rem",
                    outline: "none"
                  }}
                />
                {errors.email && <p style={{ color: "#f43f5e", fontSize: "0.78rem", marginTop: "5px" }}>{errors.email}</p>}
              </div>

              {/* Phone */}
              <div>
                <label style={{ display: "block", marginBottom: "6px", fontSize: "0.82rem", color: T.textMuted, fontFamily: T.mono }}>
                  CONTACT NUMBER *
                </label>
                <div style={{
                  display: "flex",
                  background: T.bg2,
                  border: errors.phone ? "1px solid #f43f5e" : `1px solid ${T.border}`,
                  borderRadius: 10,
                  overflow: "hidden",
                  flexDirection: "row"
                }}>
                  <select
                    value={formData.countryCode}
                    onChange={handleCountryChange}
                    style={{
                      background: T.bg1,
                      color: T.textPrimary,
                      border: "none",
                      padding: "13px 14px",
                      fontSize: "1rem",
                      minWidth: "125px",
                      borderRight: `1px solid ${T.border}`,
                      outline: "none",
                      cursor: "pointer"
                    }}
                  >
                    <option value="+91">🇮🇳 +91</option>
                    <option value="+1">🇺🇸 +1</option>
                    <option value="+44">🇬🇧 +44</option>
                    <option value="+61">🇦🇺 +61</option>
                    <option value="+971">🇦🇪 +971</option>
                  </select>

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="98765 43210"
                    style={{
                      flex: 1,
                      padding: "13px 15px",
                      background: "transparent",
                      border: "none",
                      color: T.textPrimary,
                      fontSize: "1rem",
                      outline: "none"
                    }}
                  />
                </div>
                {errors.phone && <p style={{ color: "#f43f5e", fontSize: "0.78rem", marginTop: "5px" }}>{errors.phone}</p>}
              </div>

              {/* Company */}
              <div>
                <label style={{ display: "block", marginBottom: "6px", fontSize: "0.82rem", color: T.textMuted, fontFamily: T.mono }}>
                  COMPANY NAME *
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Your Company Name"
                  style={{
                    width: "100%",
                    padding: "13px 15px",
                    background: T.bg2,
                    border: errors.company ? "1px solid #f43f5e" : `1px solid ${T.border}`,
                    borderRadius: 10,
                    color: T.textPrimary,
                    fontSize: "1rem",
                    outline: "none"
                  }}
                />
                {errors.company && <p style={{ color: "#f43f5e", fontSize: "0.78rem", marginTop: "5px" }}>{errors.company}</p>}
              </div>

              {/* Message - Optional */}
              <div>
                <label style={{ display: "block", marginBottom: "6px", fontSize: "0.82rem", color: T.textMuted, fontFamily: T.mono }}>
                  MESSAGE (OPTIONAL)
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Any specific requirements or preferred demo time?"
                  rows={3}                    // Reduced from 4 to 3
                  style={{
                    width: "100%",
                    padding: "13px 15px",
                    background: T.bg2,
                    border: `1px solid ${T.border}`,
                    borderRadius: 10,
                    color: T.textPrimary,
                    fontSize: "1rem",
                    resize: "vertical",
                    outline: "none"
                  }}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: "2.2rem",           // Reduced margin
                width: "100%",
                padding: "15px",
                background: `linear-gradient(135deg, ${T.teal}, ${T.amber})`,
                color: "#fff",
                border: "none",
                borderRadius: 12,
                fontSize: "1.05rem",
                fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
                boxShadow: `0 8px 25px ${T.teal}40`
              }}
            >
              {loading ? "Submitting..." : "Request Demo"}
            </button>
          </form>
        </div>

        <p style={{
          textAlign: "center",
          marginTop: "1.5rem",
          color: T.textMuted,
          fontSize: "0.82rem"
        }}>
          We'll get back to you within 24 hours.
        </p>
      </div>
    </div>
  );
}