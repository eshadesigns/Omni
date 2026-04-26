import { useApp } from "../../context/AppContext";
import { useTranslation } from "../../utils/translations";
import { LanguageToggle, HelpButton, BackButton } from "../ui";

export default function GradeScreen({ onNext, onBack }) {
  const { updateState } = useApp();
  const t = useTranslation();

  function select(grade) {
    updateState({ gradeLevel: grade });
    onNext();
  }

  return (
    <div style={{ minHeight: "100vh", background: "#6B2FBE", padding: "40px 32px", position: "relative" }}>
      <LanguageToggle />
      <BackButton onClick={onBack} label={t.back} />
      <h3 style={{ color: "#F4C14F", fontFamily: "serif", fontWeight: 700, fontSize: 18, marginTop: 16, marginBottom: 8 }}>
        {t.gradeTitle}
      </h3>
      <h2 style={{ color: "#fff", fontFamily: "serif", fontWeight: 700, fontSize: 22, marginBottom: 32 }}>
        {t.gradeLabel}
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, maxWidth: 800, margin: "0 auto" }}>
        {t.grades.map(grade => (
          <div
            key={grade}
            onClick={() => select(grade)}
            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"}
            onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
            style={{ background: "#EEF0FF", borderRadius: 12, padding: "40px 20px", minHeight: 200, display: "flex", alignItems: "flex-end", cursor: "pointer", fontWeight: 700, fontFamily: "serif", fontSize: 18, color: "#111", boxShadow: "4px 4px 0 #0004", border: "2px solid #C5C8FF", transition: "transform 0.15s" }}
          >
            {grade}
          </div>
        ))}
      </div>
      <HelpButton screen="grade" />
    </div>
  );
}
