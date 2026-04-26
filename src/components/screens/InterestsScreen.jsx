import { useApp } from "../../context/AppContext";
import { useTranslation } from "../../utils/translations";
import { LanguageToggle, HelpButton, BackButton } from "../ui";

const COLORS = ["#FFB3D1", "#FFB3D1", "#FFB3D1", "#E8EEFF"];

export default function InterestsScreen({ onNext, onBack }) {
  const { updateState } = useApp();
  const t = useTranslation();

  function select(interest) {
    updateState({ interests: interest });
    onNext();
  }

  return (
    <div style={{ minHeight: "100vh", background: "#6B2FBE", padding: "40px 32px", position: "relative" }}>
      <LanguageToggle />
      <BackButton onClick={onBack} label={t.back} />
      <h2 style={{ color: "#F4C14F", fontFamily: "serif", fontWeight: 700, fontSize: 22, marginTop: 16, marginBottom: 32 }}>
        {t.interestsLabel}
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, maxWidth: 860, margin: "0 auto" }}>
        {t.interests.map((interest, i) => (
          <div
            key={interest}
            onClick={() => select(interest)}
            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"}
            onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
            style={{ background: COLORS[i], borderRadius: 12, padding: "32px 16px", minHeight: 160, display: "flex", alignItems: "flex-end", cursor: "pointer", fontWeight: 700, fontFamily: "serif", fontSize: 18, color: "#111", boxShadow: "4px 4px 0 #0004", border: "2px solid rgba(0,0,0,0.1)", transition: "transform 0.15s" }}
          >
            {interest}
          </div>
        ))}
      </div>
      <HelpButton screen="interests" />
    </div>
  );
}
