import { useEffect, useRef, useState } from "react";
import { useApp } from "../../context/AppContext";
import { useTranslation } from "../../utils/translations";
import {
  LanguageToggle,
  HelpButton,
  BackButton,
  NotebookCard,
} from "../ui";
import { speak } from "../../services/voiceEngine";

export default function FinalScreen({
  onBack,
  finalData,
  loading,
  error,
  onRestart,
  onRegenerateFinal,
}) {
  const { lang } = useApp();
  const t = useTranslation();

  const [voiceActive, setVoiceActive] = useState(false);
  const abortRef = useRef(false);

  const prevLang = useRef(lang);

  useEffect(() => {
    if (prevLang.current !== lang && !loading) {
      onRegenerateFinal?.();
      prevLang.current = lang;
    }
  }, [lang]);

  const cardTitles =
    t.finalCards?.[lang] ??
    t.finalCards?.en ??
    ["Key decisions made", "Next milestone", "What to focus on now"];

  const resolvedCards = cardTitles.map((card, index) => ({
    title: card.title || "",
    content:
      [
        finalData?.summary,
        finalData?.recommendedPath,
        Array.isArray(finalData?.actionSteps)
          ? finalData.actionSteps.join("\n")
          : finalData?.actionSteps || "…",
      ][index] || "…",
  }));

  const buildNarration = () => {
    const steps = finalData?.actionSteps || [];

    const intro =
      lang === "es"
        ? "Voy a guiarte paso a paso por el plan académico."
        : "I’m going to walk you through the academic roadmap step by step.";

    const summary = finalData?.summary || "";

    const stepsText = steps
      .map((s, i) =>
        lang === "es" ? `Paso ${i + 1}: ${s}` : `Step ${i + 1}: ${s}`
      )
      .join(". ");

    const closing =
      lang === "es"
        ? "Si quieres, podemos ajustarlo juntos."
        : "If you want, we can refine this together.";

    return `${intro}. ${summary}. ${stepsText}. ${closing}`;
  };

  const startVoiceCoach = async () => {
    if (!finalData) return;

    abortRef.current = false;
    setVoiceActive(true);

    const narration = buildNarration();

    try {
      await speak(narration, lang);
    } catch (e) {
      console.error(e);
    }

    if (!abortRef.current) setVoiceActive(false);
  };

  const stopVoiceCoach = () => {
    abortRef.current = true;
    window.speechSynthesis.cancel();
    setVoiceActive(false);
  };

  const actions = [
    { label: t.adjust, color: "#FF6EB4", onClick: onBack },
    { label: t.explore, color: "#C8A0FF", onClick: onRestart },
    {
      label: t.save,
      color: "#FF8C5A",
      onClick: () => alert("PDF export coming next step"),
    },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#6B2FBE", padding: 32 }}>
      <LanguageToggle />
      <BackButton onClick={onBack} label={t.back} />

      <h2 style={{ color: "#F4C14F", fontFamily: "serif" }}>
        {t.finalTitle}
      </h2>

      {!loading && !error && (
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <button
            onClick={voiceActive ? stopVoiceCoach : startVoiceCoach}
            style={{
              background: voiceActive ? "#ff4d4d" : "#F4C14F",
              border: "none",
              borderRadius: 24,
              padding: "14px 20px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            🔊 {voiceActive ? "Stop" : "Talk me through it"}
          </button>
        </div>
      )}

      {loading ? (
        <div style={{ color: "#fff", textAlign: "center" }}>
          {t.generating}
        </div>
      ) : error ? (
        <div style={{ color: "#FFB3B3", textAlign: "center" }}>
          {error.reason || error.error}
        </div>
      ) : (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 20,
              maxWidth: 900,
              margin: "0 auto 48px",
            }}
          >
            {resolvedCards.map((card, i) => (
              <NotebookCard
                key={i}
                title={card.title}
                content={String(card.content)}
              />
            ))}
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: 20 }}>
            {actions.map((btn, i) => (
              <button
                key={i}
                onClick={btn.onClick}
                style={{
                  background: btn.color,
                  border: "none",
                  borderRadius: 24,
                  padding: "16px 28px",
                  fontWeight: 700,
                }}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </>
      )}

      <HelpButton screen="final" />
    </div>
  );
}