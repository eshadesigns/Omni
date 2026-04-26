import { useEffect, useRef } from "react";
import { useApp } from "../../context/AppContext";
import { useTranslation } from "../../utils/translations";
import { LanguageToggle, HelpButton, BackButton, NotebookCard } from "../ui";
export default function FinalScreen({
  onBack,
  finalData,
  loading,
  error,
  onRestart,
  onRegenerateFinal
}) {
  const { lang } = useApp();
  const t = useTranslation();

  // Regenerate when language changes
  const prevLang = useRef(lang);

  useEffect(() => {
    if (prevLang.current !== lang && !loading) {
      onRegenerateFinal?.();
      prevLang.current = lang;
    }
  }, [lang]);

  const cardTitles = t.finalCards?.[lang] ?? t.finalCards?.en ?? ["Key decisions made", "Next milestone", "What to focus on now"];

  const resolvedCards = cardTitles.map((card, index) => ({
    title: card.title || "",
    content: [finalData?.summary, finalData?.recommendedPath, Array.isArray(finalData?.actionSteps) ? finalData.actionSteps.join(" \n") : finalData?.actionSteps || "…"]
      [index] || "…",
  }));

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
    <div style={{
      minHeight: "100vh",
      background: "#6B2FBE",
      padding: "32px 32px 80px",
      position: "relative"
    }}>
      <LanguageToggle />
      <BackButton onClick={onBack} label={t.back} />

      <h2 style={{
        color: "#F4C14F",
        fontFamily: "serif",
        fontWeight: 700,
        fontSize: 22,
        marginTop: 16,
        marginBottom: 32
      }}>
        {t.finalTitle}
      </h2>

      {loading ? (
        <div style={{
          textAlign: "center",
          color: "#fff",
          fontFamily: "serif",
          fontSize: 18,
          marginTop: 60
        }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>✦</div>
          {t.generating}
        </div>
      ) : error ? (
        <div style={{ textAlign: "center", color: "#FFB3B3", fontFamily: "serif", fontSize: 16, marginTop: 60, maxWidth: 700, marginLeft: "auto", marginRight: "auto" }}>
          <div style={{ marginBottom: 16 }}>Something went wrong while loading the final plan.</div>
          <div style={{ marginBottom: 24, fontSize: 14 }}>{error.reason || error.error}</div>
          <button
            onClick={onRegenerateFinal}
            style={{
              background: "#FF8C5A",
              border: "none",
              borderRadius: 24,
              padding: "16px 28px",
              fontSize: 15,
              fontWeight: 700,
              color: "#2C1810",
              cursor: "pointer",
              fontFamily: "serif",
              boxShadow: "3px 3px 0 #0003"
            }}
          >
            Retry
          </button>
        </div>
      ) : (
        <>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 20,
            maxWidth: 900,
            margin: "0 auto 48px",
            position: "relative"
          }}>
            <div style={{
              position: "absolute",
              top: "30%",
              left: "10%",
              right: "10%",
              height: "40%",
              border: "2px dashed #fff4",
              borderRadius: 8,
              zIndex: 0
            }} />

            {resolvedCards.map((card, i) => (
              <div key={i} style={{ position: "relative", zIndex: 1 }}>
                <NotebookCard
                  title={card.title}
                  content={String(card.content)}
                />
              </div>
            ))}
          </div>

          <div style={{
            display: "flex",
            gap: 20,
            justifyContent: "center",
            flexWrap: "wrap"
          }}>
            {actions.map((btn, i) => (
              <button
                key={i}
                onClick={btn.onClick}
                style={{
                  background: btn.color,
                  border: "none",
                  borderRadius: 24,
                  padding: "16px 28px",
                  fontSize: 15,
                  fontWeight: 700,
                  color: "#2C1810",
                  cursor: "pointer",
                  fontFamily: "serif",
                  boxShadow: "3px 3px 0 #0003"
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