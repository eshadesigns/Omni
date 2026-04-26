import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { useTranslation } from "../../utils/translations";
import { LanguageToggle, HelpButton, BackButton, PrimaryButton } from "../ui";

const PATH_COLORS = ["#F4C14F", "#FF6EB4", "#8EC8C8"];

export default function SimulationScreen({ onNext, onBack, simData, loading, error, onRetry }) {
  const { lang } = useApp();
  const t = useTranslation();
  const [selected, setSelected] = useState(null);

  return (
    <div style={{ minHeight: "100vh", background: "#6B2FBE", padding: "32px 32px 80px", position: "relative" }}>
      <LanguageToggle />
      <BackButton onClick={onBack} label={t.back} />
      <h2 style={{ color: "#F4C14F", fontFamily: "serif", fontWeight: 700, fontSize: 18, marginTop: 16, marginBottom: 32, maxWidth: 600 }}>
        {t.simTitle}
      </h2>

      {loading ? (
        <div style={{ textAlign: "center", color: "#fff", fontFamily: "serif", fontSize: 18, marginTop: 60 }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>✦</div>
          {t.generating}
        </div>
      ) : error ? (
        <div style={{ textAlign: "center", color: "#FFB3B3", fontFamily: "serif", fontSize: 16, marginTop: 60, maxWidth: 700, marginLeft: "auto", marginRight: "auto" }}>
          <div style={{ marginBottom: 16 }}>Something went wrong while loading the simulation.</div>
          <div style={{ marginBottom: 24, fontSize: 14 }}>{error.reason || error.error}</div>
          <PrimaryButton onClick={onRetry}>Try again</PrimaryButton>
        </div>
      ) : (
        <>
          <div style={{ position: "relative", marginBottom: 32 }}>
            {/* Road decoration */}
            <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 80, background: "linear-gradient(135deg, #C8600A, #E8820A)", borderRadius: 40, zIndex: 0, opacity: 0.7 }} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, position: "relative", zIndex: 1, maxWidth: 860, margin: "0 auto" }}>
              {t.pathLabels.map(([label, sublabel], i) => {
                const pathKey = t.pathKeys[i];
                const pathData = simData?.[pathKey] || {};
                const isSelected = selected === i;
                return (
                  <div
                    key={i}
                    onClick={() => setSelected(isSelected ? null : i)}
                    style={{ background: isSelected ? PATH_COLORS[i] : "#FAF5E8", borderRadius: 12, border: `2px solid ${isSelected ? PATH_COLORS[i] : "#5B5B5B"}`, padding: 16, cursor: "pointer", boxShadow: isSelected ? `0 8px 24px ${PATH_COLORS[i]}66` : "2px 2px 0 #0004", transition: "all 0.2s" }}
                  >
                    {/* Notebook binding */}
                    <div style={{ display: "flex", gap: 2, marginBottom: 8 }}>
                      {Array.from({ length: 8 }).map((_, j) => (
                        <div key={j} style={{ width: 6, height: 8, background: "#8B6B4A" }} />
                      ))}
                    </div>
                    <div style={{ fontWeight: 700, fontFamily: "serif", fontSize: 16, color: "#2C1810" }}>{label}</div>
                    <div style={{ fontWeight: 700, fontFamily: "serif", fontSize: 14, color: "#5B3A1E", marginBottom: 12 }}>{sublabel}</div>

                    {isSelected && pathData.summary && (
                      <div style={{ fontSize: 12, color: "#2C1810", lineHeight: 1.5, marginTop: 8 }}>
                        <div style={{ marginBottom: 6 }}><strong>{t.courses}</strong> {pathData.courses}</div>
                        <div style={{ marginBottom: 6 }}><strong>{t.testing}</strong> {pathData.testing}</div>
                        <div style={{ marginBottom: 6 }}><strong>{t.extracurriculars}</strong> {pathData.extracurriculars}</div>
                        <div style={{ marginBottom: 6 }}><strong>{t.collegeRange}</strong> {pathData.collegeRange}</div>
                        <div style={{ padding: 8, background: "#fff8", borderRadius: 8, marginTop: 8 }}>
                          <strong>{t.mostLikely}</strong> {pathData.summary}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <PrimaryButton onClick={onNext}>{t.next}</PrimaryButton>
          </div>
        </>
      )}
      <HelpButton screen="simulation" />
    </div>
  );
}
