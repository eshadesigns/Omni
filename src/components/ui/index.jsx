// src/components/ui/index.jsx
// ─────────────────────────────────────────────
// Reusable UI primitives used across all screens.
// ─────────────────────────────────────────────

import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { helpContent } from "../../utils/translations";

// ── Language Toggle ──────────────────────────

export function LanguageToggle() {
  const { lang, setLang } = useApp();

  return (
    <div
      style={{
        position: "absolute",
        top: 20,
        right: 20,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
        zIndex: 100,
      }}
    >
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
          transition: "all 0.3s",
        }}
      >
        <div
          style={{
            width: 22,
            height: 22,
            borderRadius: "50%",
            background: "#F4C14F",
            transform:
              lang === "en" ? "translateX(0)" : "translateX(30px)",
            transition: "transform 0.3s",
          }}
        />
      </div>
      <span
        style={{
          color: "#fff",
          fontSize: 13,
          fontFamily: "serif",
          fontWeight: 600,
        }}
      >
        {lang === "en" ? "English" : "Español"}
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────
// HARDCODED HELP ANSWERS
// ─────────────────────────────────────────────

function getHardcodedAnswer(question, screen, lang) {
  const answers = {
    simulation: {
      en: {
        "What does this path mean?":
          "Each path represents a realistic academic strategy based on workload, stress, and college competitiveness.",
        "How accurate are these projections?":
          "They are directional models based on typical student outcomes, not exact predictions.",
        "What if my child changes direction?":
          "The plan is flexible and can be adjusted at any time as your child’s interests or performance change.",
      },
      es: {
        "What does this path mean?":
          "Cada camino representa una estrategia académica basada en carga de trabajo, estrés y competitividad universitaria.",
        "How accurate are these projections?":
          "Son modelos orientativos basados en resultados típicos, no predicciones exactas.",
        "What if my child changes direction?":
          "El plan es flexible y puede cambiar en cualquier momento según los intereses o desempeño del estudiante.",
      },
    },

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

    // ✅ FIXED: INTERESTS ADDED (this was missing before)
    interests: {
      en: {
        "What if my child is undecided?":
          "That's completely fine — Omni will suggest a balanced mix of paths until clearer interests emerge.",
        "Can I pick multiple interests?":
          "Yes — selecting multiple interests helps Omni build a more flexible and realistic plan.",
      },
      es: {
        "What if my child is undecided?":
          "Está bien — Omni sugerirá una mezcla equilibrada hasta que haya intereses más claros.",
        "Can I pick multiple interests?":
          "Sí — elegir múltiples intereses ayuda a crear un plan más flexible.",
      },
    },
  };

  return (
    answers?.[screen]?.[lang]?.[question] ||
    (lang === "en"
      ? "Sorry — no help available for this question yet."
      : "Lo siento — no hay respuesta disponible aún.")
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
    console.log("HELP CLICKED:", question);

    setActiveQ(question);
    setAnswer("");
    setAnswerLoading(true);

    const reply = getHardcodedAnswer(question, screen, lang);

    setTimeout(() => {
      setAnswer(reply);
      setAnswerLoading(false);
    }, 300);
  }

  function handleClose() {
    setOpen(false);
    setActiveQ(null);
    setAnswer("");
  }

  const label = {
    heading: lang === "en" ? "Need help?" : "¿Necesitas ayuda?",
    thinking: lang === "en" ? "Loading…" : "Cargando…",
    back: lang === "en" ? "← Back to questions" : "← Volver a preguntas",
    close: lang === "en" ? "Close" : "Cerrar",
  };

  return (
    <>
      <button
        onClick={() => {
          setOpen((o) => !o);
          if (open) handleClose();
        }}
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
          cursor: "pointer",
          color: "#111",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 200,
          boxShadow: "2px 2px 0 #111",
        }}
      >
        ?
      </button>

      {open && (
        <div
          style={{
            position: "fixed",
            bottom: 90,
            right: 24,
            background: "#fff",
            borderRadius: 16,
            border: "2px solid #111",
            padding: "16px 20px",
            minWidth: 260,
            maxWidth: 320,
            zIndex: 200,
            boxShadow: "4px 4px 0 #111",
          }}
        >
          <div
            style={{
              fontWeight: 700,
              marginBottom: 10,
              color: "#5B2D8E",
              fontFamily: "serif",
              fontSize: 15,
            }}
          >
            {label.heading}
          </div>

          {!activeQ ? (
            items.map((item, i) => (
              <div
                key={i}
                onClick={() => askQuestion(item)}
                style={{
                  padding: "8px 10px",
                  fontSize: 13,
                  color: "#5B2D8E",
                  borderBottom:
                    i < items.length - 1 ? "0.5px solid #eee" : "none",
                  cursor: "pointer",
                  borderRadius: 6,
                }}
              >
                <span style={{ marginRight: 6, fontSize: 11 }}>▶</span>
                {item}
              </div>
            ))
          ) : (
            <div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#5B2D8E",
                  marginBottom: 8,
                  lineHeight: 1.4,
                }}
              >
                {activeQ}
              </div>

              {answerLoading ? (
                <div style={{ fontSize: 13, color: "#888", fontStyle: "italic" }}>
                  {label.thinking}
                </div>
              ) : (
                <div style={{ fontSize: 13, color: "#333", lineHeight: 1.6 }}>
                  {answer}
                </div>
              )}

              <button
                onClick={() => {
                  setActiveQ(null);
                  setAnswer("");
                }}
                style={{
                  marginTop: 10,
                  fontSize: 12,
                  color: "#5B2D8E",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  textDecoration: "underline",
                }}
              >
                {label.back}
              </button>
            </div>
          )}

          <button
            onClick={handleClose}
            style={{
              marginTop: 12,
              width: "100%",
              padding: "6px 0",
              background: "#5B2D8E",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              fontSize: 13,
            }}
          >
            {label.close}
          </button>
        </div>
      )}
    </>
  );
}