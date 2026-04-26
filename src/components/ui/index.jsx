// src/components/ui/index.jsx
// ─────────────────────────────────────────────
// Reusable UI primitives used across all screens.
// ─────────────────────────────────────────────

import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { helpContent } from "../../utils/translations";
import { answerHelpQuestion } from "../../engines/chatEngine";

// ── Language Toggle ──────────────────────────

export function LanguageToggle() {
  const { lang, setLang } = useApp();
  return (
    <div style={{ position: "absolute", top: 20, right: 20, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, zIndex: 100 }}>
      <div
        onClick={() => setLang(lang === "en" ? "es" : "en")}
        style={{ width: 60, height: 30, borderRadius: 15, background: "#fff3", cursor: "pointer", display: "flex", alignItems: "center", padding: "0 4px", border: "2px solid #fff6", transition: "all 0.3s" }}
      >
        <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#F4C14F", transform: lang === "en" ? "translateX(0)" : "translateX(30px)", transition: "transform 0.3s" }} />
      </div>
      <span style={{ color: "#fff", fontSize: 13, fontFamily: "serif", fontWeight: 600 }}>
        {lang === "en" ? "English" : "Español"}
      </span>
    </div>
  );
}

// ── Help Button ──────────────────────────────

export function HelpButton({ screen }) {
  const { lang } = useApp();
  const [open, setOpen] = useState(false);
  const [activeQ, setActiveQ] = useState(null);
  const [answer, setAnswer] = useState("");
  const [answerLoading, setAnswerLoading] = useState(false);
  const items = helpContent[lang]?.[screen] ?? [];

  async function askQuestion(question) {
    setActiveQ(question);
    setAnswer("");
    setAnswerLoading(true);
    try {
      const reply = await answerHelpQuestion(question, screen, lang);
      setAnswer(reply);
    } catch {
      setAnswer(lang === "en" ? "Sorry, I couldn't load an answer. Try again." : "Lo siento, no pude cargar una respuesta.");
    }
    setAnswerLoading(false);
  }

  function handleClose() {
    setOpen(false);
    setActiveQ(null);
    setAnswer("");
  }

  const label = {
    heading: lang === "en" ? "Need help?" : "¿Necesitas ayuda?",
    thinking: lang === "en" ? "Omni is thinking…" : "Omni está pensando…",
    back: lang === "en" ? "← Back to questions" : "← Volver a preguntas",
    close: lang === "en" ? "Close" : "Cerrar",
  };

  return (
    <>
      <button
        onClick={() => { setOpen(o => !o); if (open) handleClose(); }}
        style={{ position: "fixed", bottom: 24, right: 24, width: 52, height: 52, borderRadius: "50%", background: "#fff", border: "3px solid #111", fontSize: 22, fontWeight: 700, cursor: "pointer", color: "#111", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, boxShadow: "2px 2px 0 #111" }}
      >?</button>

      {open && (
        <div style={{ position: "fixed", bottom: 90, right: 24, background: "#fff", borderRadius: 16, border: "2px solid #111", padding: "16px 20px", minWidth: 260, maxWidth: 320, zIndex: 200, boxShadow: "4px 4px 0 #111" }}>
          <div style={{ fontWeight: 700, marginBottom: 10, color: "#5B2D8E", fontFamily: "serif", fontSize: 15 }}>{label.heading}</div>

          {!activeQ ? (
            items.map((item, i) => (
              <div key={i} onClick={() => askQuestion(item)}
                style={{ padding: "8px 10px", fontSize: 13, color: "#5B2D8E", borderBottom: i < items.length - 1 ? "0.5px solid #eee" : "none", cursor: "pointer", borderRadius: 6 }}
                onMouseEnter={e => e.currentTarget.style.background = "#F3EEFF"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <span style={{ marginRight: 6, fontSize: 11 }}>▶</span>{item}
              </div>
            ))
          ) : (
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#5B2D8E", marginBottom: 8, lineHeight: 1.4 }}>{activeQ}</div>
              {answerLoading
                ? <div style={{ fontSize: 13, color: "#888", fontStyle: "italic" }}>{label.thinking}</div>
                : <div style={{ fontSize: 13, color: "#333", lineHeight: 1.6 }}>{answer}</div>
              }
              <button onClick={() => { setActiveQ(null); setAnswer(""); }}
                style={{ marginTop: 10, fontSize: 12, color: "#5B2D8E", background: "none", border: "none", cursor: "pointer", padding: 0, textDecoration: "underline" }}
              >{label.back}</button>
            </div>
          )}

          <button onClick={handleClose}
            style={{ marginTop: 12, width: "100%", padding: "6px 0", background: "#5B2D8E", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 13 }}
          >{label.close}</button>
        </div>
      )}
    </>
  );
}

// ── Progress Bar ─────────────────────────────

export function ProgressBar({ current, total }) {
  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 4, background: "#2C1878", zIndex: 300 }}>
      <div style={{ height: "100%", background: "#F4C14F", width: `${(current / total) * 100}%`, transition: "width 0.4s ease" }} />
    </div>
  );
}

// ── Back Button ──────────────────────────────

export function BackButton({ onClick, label }) {
  return (
    <button onClick={onClick}
      style={{ background: "none", border: "none", color: "#F4C14F", cursor: "pointer", fontFamily: "serif", fontSize: 15, marginTop: 8, padding: 0 }}
    >{label}</button>
  );
}

// ── Primary CTA Button ────────────────────────

export function PrimaryButton({ onClick, children }) {
  return (
    <button onClick={onClick}
      style={{ background: "linear-gradient(135deg, #F4C14F, #FF7A45)", border: "none", borderRadius: 50, padding: "14px 40px", fontSize: 16, fontWeight: 700, color: "#fff", cursor: "pointer", fontFamily: "serif" }}
    >{children}</button>
  );
}

// ── Notebook Card ─────────────────────────────

export function NotebookCard({ title, content }) {
  return (
    <div style={{ background: "#FAF5E8", borderRadius: 12, border: "2px solid #5B5B5B", padding: "20px 20px 24px" }}>
      <div style={{ display: "flex", gap: 2, marginBottom: 8 }}>
        {Array.from({ length: 8 }).map((_, j) => (
          <div key={j} style={{ width: 6, height: 8, background: "#8B6B4A" }} />
        ))}
      </div>
      <div style={{ fontWeight: 700, fontFamily: "serif", fontSize: 16, color: "#2C1810", marginBottom: 10 }}>{title}</div>
      <div style={{ fontSize: 13, color: "#4A3728", lineHeight: 1.6 }}>{content}</div>
    </div>
  );
}

// ── Screen Shell ──────────────────────────────
// Wraps every screen with bg, padding, toggle, and help button.

export function ScreenShell({ children, screen, centered = false }) {
  return (
    <div style={{
      minHeight: "100vh", background: "#6B2FBE",
      padding: "40px 32px 80px", position: "relative",
      display: centered ? "flex" : "block",
      flexDirection: centered ? "column" : undefined,
      alignItems: centered ? "center" : undefined,
      justifyContent: centered ? "center" : undefined,
    }}>
      <LanguageToggle />
      {children}
      <HelpButton screen={screen} />
    </div>
  );
}
