import { useApp } from "../../context/AppContext";
import { useTranslation } from "../../utils/translations";
import { LanguageToggle, HelpButton } from "../ui";

const BG_COLORS = ["#F4C14F", "#FF6EB4", "#FF8C5A", "#8EC8C8"];

export default function IntentScreen({ onNext }) {
  const { updateState } = useApp();
  const t = useTranslation();

  function select(id) {
    updateState({ intent: id });
    onNext();
  }

  return (
    <div style={{ minHeight: "100vh", background: "#6B2FBE", padding: "40px 32px", position: "relative" }}>
      <LanguageToggle />
      <h2 style={{ color: "#F4C14F", fontFamily: "serif", fontWeight: 700, fontSize: 20, marginBottom: 32, marginTop: 40 }}>
        {t.intentQ}
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, maxWidth: 700, margin: "0 auto" }}>
        {t.intents.map((intent, i) => (
          <div
            key={intent.id}
            onClick={() => select(intent.id)}
            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px) scale(1.02)"}
            onMouseLeave={e => e.currentTarget.style.transform = "translateY(0) scale(1)"}
            style={{ background: BG_COLORS[i], borderRadius: 12, padding: "32px 24px", cursor: "pointer", minHeight: 160, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "4px 4px 0 #0004", transition: "transform 0.15s", border: "2px solid rgba(0,0,0,0.15)" }}
          >
            <span style={{ fontWeight: 700, fontFamily: "serif", fontSize: 16, textAlign: "center", color: "#2C1810" }}>
              {intent.label}
            </span>
          </div>
        ))}
      </div>
      <HelpButton screen="intent" />
    </div>
  );
}
