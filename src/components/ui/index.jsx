// src/components/ui/index.jsx
// ─────────────────────────────────────────────
// Reusable UI primitives used across all screens.
// FIXED: ensures ALL exports exist consistently
// ─────────────────────────────────────────────

import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { helpContent } from "../../utils/translations";

// ─────────────────────────────────────────────
// Language Toggle
// ─────────────────────────────────────────────

export function LanguageToggle() {
  const { lang, setLang } = useApp();

  return (
    <div style={{
      position: "absolute",
      top: 20,
      right: 20,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 4,
      zIndex: 100,
    }}>
      <div
        onClick={() => setLang(lang === "en" ? "es" : "en")}
        style={{
          width: 60,
          height: 30,
          borderRadius: 15,
          background: "#fff3",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          padding: "0 4px",
          border: "2px solid #fff6",
        }}
      >
        <div
          style={{
            width: 22,
            height: 22,
            borderRadius: "50%",
            background: "#F4C14F",
            transform: lang === "en" ? "translateX(0)" : "translateX(30px)",
            transition: "transform 0.3s",
          }}
        />
      </div>

      <span style={{
        color: "#fff",
        fontSize: 13,
        fontFamily: "serif",
        fontWeight: 600,
      }}>
        {lang === "en" ? "English" : "Español"}
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────
// HELP SYSTEM
// ─────────────────────────────────────────────

function getHardcodedAnswer(question, screen, lang) {
  const answers = {
    grade: {
      en: {
        "Why does grade level matter?":
          "Grade level determines course availability and what academic paths are realistic.",
        "What if my child is between levels?":
          "We automatically adjust recommendations based on blended readiness.",
      },
      es: {
        "Why does grade level matter?":
          "El nivel escolar determina qué cursos están disponibles y qué caminos son realistas.",
        "What if my child is between levels?":
          "Ajustamos automáticamente las recomendaciones según su nivel.",
      },
    },

    interests: {
      en: {
        "What if my child is undecided?":
          "That's fine — Omni will suggest balanced options until interests are clearer.",
        "Can I pick multiple interests?":
          "Yes — multiple interests help build a more flexible plan.",
      },
      es: {
        "What if my child is undecided?":
          "Está bien — Omni sugerirá opciones equilibradas.",
        "Can I pick multiple interests?":
          "Sí — múltiples intereses ayudan a crear un plan más flexible.",
      },
    },

    simulation: {
      en: {
        "What does this path mean?":
          "Represents a realistic academic strategy.",
        "How accurate are these projections?":
          "They are directional, not exact predictions.",
        "What if my child changes direction?":
          "The plan can be adjusted anytime.",
      },
    },
  };

  return (
    answers?.[screen]?.[lang]?.[question] ||
    (lang === "en"
      ? "No help available yet."
      : "No hay ayuda disponible todavía.")
  );
}

// ─────────────────────────────────────────────
// HELP BUTTON
// ─────────────────────────────────────────────

export function HelpButton({ screen }) {
  const { lang } = useApp();
  const [open, setOpen] = useState(false);
  const [activeQ, setActiveQ] = useState(null);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const items = helpContent?.[lang]?.[screen] ?? [];

  function ask(question) {
    setActiveQ(question);
    setLoading(true);
    setAnswer("");

    const reply = getHardcodedAnswer(question, screen, lang);

    setTimeout(() => {
      setAnswer(reply);
      setLoading(false);
    }, 250);
  }

  return (
    <>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          width: 52,
          height: 52,
          borderRadius: "50%",
          background: "#fff",
          border: "3px solid #111",
          fontSize: 22,
          fontWeight: 700,
          zIndex: 200,
        }}
      >
        ?
      </button>

      {open && (
        <div style={{
          position: "fixed",
          bottom: 90,
          right: 24,
          background: "#fff",
          border: "2px solid #111",
          borderRadius: 14,
          padding: 16,
          width: 280,
          zIndex: 200,
        }}>
          {!activeQ ? (
            items.map((q, i) => (
              <div key={i}
                onClick={() => ask(q)}
                style={{ padding: 8, cursor: "pointer" }}>
                ▶ {q}
              </div>
            ))
          ) : (
            <div>
              <b>{activeQ}</b>
              <div style={{ marginTop: 10 }}>
                {loading ? "Loading…" : answer}
              </div>
              <button onClick={() => setActiveQ(null)}>
                Back
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}

// ─────────────────────────────────────────────
// REQUIRED UI PRIMITIVES (FIX FOR YOUR ERRORS)
// ─────────────────────────────────────────────

export function BackButton({ onClick, label }) {
  return (
    <button onClick={onClick}
      style={{ background: "none", border: "none", color: "#F4C14F" }}>
      {label}
    </button>
  );
}

export function PrimaryButton({ onClick, children }) {
  return (
    <button onClick={onClick}
      style={{
        background: "#F4C14F",
        border: "none",
        padding: "12px 24px",
        borderRadius: 999,
        fontWeight: 700,
      }}>
      {children}
    </button>
  );
}

export function NotebookCard({ title, content }) {
  return (
    <div style={{ padding: 16, border: "2px solid #000" }}>
      <b>{title}</b>
      <div>{content}</div>
    </div>
  );
}

export function ProgressBar({ current, total }) {
  return (
    <div style={{ height: 6, background: "#222" }}>
      <div style={{
        height: "100%",
        width: `${(current / total) * 100}%`,
        background: "#F4C14F",
      }} />
    </div>
  );
}

// ─────────────────────────────────────────────
// SCREEN SHELL
// ─────────────────────────────────────────────

export function ScreenShell({ children, screen, centered }) {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#6B2FBE",
      padding: 40,
      position: "relative",
      display: centered ? "flex" : "block",
    }}>
      <LanguageToggle />
      {children}
      <HelpButton screen={screen} />
    </div>
  );
}