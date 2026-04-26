import { useApp } from "../../context/AppContext";
import { useTranslation } from "../../utils/translations";
import { LanguageToggle, HelpButton, BackButton } from "../ui";

export default function PreferenceScreen({ onNext, onBack }) {
  const { updateState } = useApp();
  const t = useTranslation();

  function select(value) {
    updateState({ preferenceWeight: value });
    onNext();
  }

  return (
    <div style={{ minHeight: "100vh", background: "#6B2FBE", padding: "40px 32px", position: "relative", display: "flex", flexDirection: "column" }}>
      <LanguageToggle />
      <BackButton onClick={onBack} label={t.back} />
      <h2 style={{ color: "#F4C14F", fontFamily: "serif", fontWeight: 700, fontSize: 22, marginTop: 16, marginBottom: 48 }}>
        {t.prefLabel}
      </h2>
      <div style={{ display: "flex", gap: 24, alignItems: "center", justifyContent: "center", flex: 1, maxWidth: 900, margin: "0 auto", width: "100%" }}>
        <div
          onClick={() => select("low_stress")}
          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.03)"}
          onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
          style={{ flex: 1, background: "#8EC8C8", borderRadius: 12, padding: "48px 32px", cursor: "pointer", fontWeight: 700, fontFamily: "serif", fontSize: 22, color: "#111", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", minHeight: 200, boxShadow: "4px 4px 0 #0004", border: "2px solid rgba(0,0,0,0.15)", transition: "transform 0.15s" }}
        >
          {t.prefA}
        </div>
        <span style={{ color: "#fff", fontFamily: "serif", fontWeight: 700, fontSize: 20 }}>{t.prefOr}</span>
        <div
          onClick={() => select("competitive")}
          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.03)"}
          onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
          style={{ flex: 1, background: "#FF6EB4", borderRadius: 12, padding: "48px 32px", cursor: "pointer", fontWeight: 700, fontFamily: "serif", fontSize: 22, color: "#111", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", minHeight: 200, boxShadow: "4px 4px 0 #0004", border: "2px solid rgba(0,0,0,0.15)", transition: "transform 0.15s" }}
        >
          {t.prefB}
        </div>
      </div>
      <HelpButton screen="preference" />
    </div>
  );
}
