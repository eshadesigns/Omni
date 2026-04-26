import { useTranslation } from "../../utils/translations";
import { LanguageToggle, HelpButton, BackButton, PrimaryButton } from "../ui";

function ratingColor(val = "") {
  const v = val.toLowerCase();
  if (v.includes("very high") || v.includes("muy alto")) return "#FF6B6B";
  if (v.includes("high") || v.includes("alto"))           return "#FFB347";
  if (v.includes("low") || v.includes("bajo"))            return "#6BCB77";
  return "#FFD166";
}

export default function ComparisonScreen({ onNext, onBack, simData }) {
  const t = useTranslation();

  return (
    <div style={{ minHeight: "100vh", background: "#6B2FBE", padding: "32px 32px 80px", position: "relative" }}>
      <LanguageToggle />
      <BackButton onClick={onBack} label={t.back} />
      <h2 style={{ color: "#F4C14F", fontFamily: "serif", fontWeight: 700, fontSize: 22, marginTop: 16, marginBottom: 32 }}>
        {t.compareTitle}
      </h2>

      <div style={{ maxWidth: 900, margin: "0 auto", background: "#FAF5E8", borderRadius: 12, overflow: "hidden", border: "2px solid #5B5B5B" }}>
        <div style={{ display: "grid", gridTemplateColumns: "180px 1fr 1fr 1fr" }}>
          {/* Header row */}
          <div style={{ background: "#FEFCD0", padding: "16px 12px", border: "2px solid #E8E55A" }} />
          {t.pathLabels.map(([label, sublabel], i) => (
            <div key={i} style={{ background: "#FEFCD0", padding: "16px 12px", textAlign: "center", border: "2px solid #E8E55A" }}>
              <div style={{ fontWeight: 700, fontFamily: "serif", fontSize: 15, color: "#2C1810" }}>{label}</div>
              <div style={{ fontWeight: 700, fontFamily: "serif", fontSize: 13, color: "#5B3A1E" }}>{sublabel}</div>
            </div>
          ))}

          {/* Data rows */}
          {t.compareRows.map((rowLabel, ri) => (
            <>
              <div key={`lbl-${ri}`} style={{ background: "#FEFCD0", padding: "14px 12px", fontWeight: 700, fontFamily: "serif", fontSize: 14, color: "#2C1810", border: "1px solid #E8E55A" }}>
                {rowLabel}
              </div>
              {t.pathKeys.map(pathKey => {
                const metricKey = t.compareMetricKeys[ri];
                const val = simData?.[pathKey]?.metrics?.[metricKey] ?? "–";
                return (
                  <div key={`${ri}-${pathKey}`} style={{ background: "#FFD6F0", padding: "14px 12px", textAlign: "center", border: "1px solid #FFC0E0" }}>
                    <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: 20, background: ratingColor(val), fontSize: 12, fontWeight: 700, color: "#2C1810" }}>
                      {val}
                    </span>
                  </div>
                );
              })}
            </>
          ))}
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: 32 }}>
        <PrimaryButton onClick={onNext}>{t.next}</PrimaryButton>
      </div>
      <HelpButton screen="comparison" />
    </div>
  );
}
