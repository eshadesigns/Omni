import { useTranslation } from "../../utils/translations";
import { LanguageToggle, HelpButton } from "../ui";

export default function LandingScreen({ onNext }) {
  const t = useTranslation();

  return (
    <div style={{ minHeight: "100vh", background: "#6B2FBE", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative" }}>
      <LanguageToggle />
      <div style={{ textAlign: "center", padding: "0 24px" }}>
        <div style={{ fontSize: "clamp(72px, 15vw, 120px)", fontFamily: "'Georgia', serif", fontWeight: 900, color: "#F4C14F", letterSpacing: -4, lineHeight: 0.9, marginBottom: 24, textShadow: "4px 4px 0 rgba(0,0,0,0.3)", fontStyle: "italic" }}>
          Omni
        </div>
        <p style={{ color: "#E8D5FF", fontSize: "clamp(14px, 2.5vw, 18px)", maxWidth: 520, margin: "0 auto 40px", fontFamily: "serif", fontWeight: 600, lineHeight: 1.5 }}>
          {t.tagline}
        </p>
        <button
          onClick={onNext}
          onMouseEnter={e => e.target.style.transform = "scale(1.05)"}
          onMouseLeave={e => e.target.style.transform = "scale(1)"}
          style={{ background: "linear-gradient(135deg, #F4C14F, #FF7A45)", border: "none", borderRadius: 50, padding: "18px 48px", fontSize: 20, fontWeight: 700, color: "#fff", cursor: "pointer", fontFamily: "serif", boxShadow: "0 4px 20px rgba(244,193,79,0.4)", transition: "transform 0.2s" }}
        >
          {t.cta}
        </button>
      </div>
      <HelpButton screen="landing" />
    </div>
  );
}
