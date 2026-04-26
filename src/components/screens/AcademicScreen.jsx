import { useApp } from "../../context/AppContext";
import { useTranslation } from "../../utils/translations";
import { LanguageToggle, HelpButton, BackButton } from "../ui";

export default function AcademicScreen({ onNext, onBack }) {
  const { updateState } = useApp();
  const t = useTranslation();

  function select(level) {
    updateState({ academicLevel: level });
    onNext();
  }

  return (
    <div style={{ minHeight: "100vh", background: "#6B2FBE", padding: "40px 32px", position: "relative" }}>
      <LanguageToggle />
      <BackButton onClick={onBack} label={t.back} />
      <h2 style={{ color: "#F4C14F", fontFamily: "serif", fontWeight: 700, fontSize: 22, marginTop: 16, marginBottom: 32 }}>
        {t.academicLabel}
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, maxWidth: 800, margin: "0 auto" }}>
        {t.academics.map(level => (
          <div
            key={level}
            onClick={() => select(level)}
            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"}
            onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
            style={{ background: "#FEFCD0", borderRadius: 12, padding: "40px 20px", minHeight: 180, display: "flex", alignItems: "flex-end", cursor: "pointer", fontWeight: 700, fontFamily: "serif", fontSize: 18, color: "#111", boxShadow: "4px 4px 0 #0004", border: "2px solid #E8E55A", transition: "transform 0.15s" }}
          >
            {level}
          </div>
        ))}
      </div>
      <HelpButton screen="academic" />
    </div>
  );
}
