import { useState, useEffect, useRef } from "react";
import { useApp } from "../../context/AppContext";
import { useTranslation } from "../../utils/translations";
import { LanguageToggle, HelpButton, BackButton, PrimaryButton } from "../ui";
import { buildWelcomeMessage, sendChatMessage } from "../../engines/chatEngine";

export default function ChatScreen({ onNext, onBack }) {
  const { lang, userState, updateState } = useApp();
  const t = useTranslation();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => {
    setMessages([{ role: "assistant", content: buildWelcomeMessage(userState, lang) }]);
  }, []);

  async function send() {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", content: input };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setLoading(true);
    updateState({ chatContext: input });

    const reply = await sendChatMessage(next, userState, lang);
    setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    setLoading(false);
    setTimeout(() => chatRef.current?.scrollTo(0, 99999), 80);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#6B2FBE", padding: "32px 32px 80px", position: "relative" }}>
      <LanguageToggle />
      <BackButton onClick={onBack} label={t.back} />
      <h2 style={{ color: "#F4C14F", fontFamily: "serif", fontWeight: 700, fontSize: 18, marginTop: 16, marginBottom: 24 }}>
        {t.chatTitle}
      </h2>

      {/* Terminal-style chat window */}
      <div style={{ maxWidth: 900, margin: "0 auto", background: "#4A2090", borderRadius: 16, border: "3px solid #222", overflow: "hidden", boxShadow: "4px 4px 0 #0006" }}>
        {/* Title bar */}
        <div style={{ background: "#3A1878", height: 28, display: "flex", alignItems: "center", padding: "0 12px", gap: 6 }}>
          {["#FF5F57", "#FEBC2E", "#28C840"].map((c, i) => (
            <div key={i} style={{ width: 12, height: 12, borderRadius: "50%", background: c }} />
          ))}
        </div>

        {/* Messages */}
        <div ref={chatRef} style={{ height: 300, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
          {messages.map((m, i) => (
            <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
              <div style={{ maxWidth: "75%", padding: "10px 14px", borderRadius: 12, background: m.role === "user" ? "#F4C14F" : "#fff", color: "#2C1810", fontSize: 14, fontFamily: "serif", lineHeight: 1.5 }}>
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: "flex", justifyContent: "flex-start" }}>
              <div style={{ background: "#fff", padding: "10px 14px", borderRadius: 12, color: "#888", fontSize: 14, fontStyle: "italic" }}>
                {t.generating}
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div style={{ background: "#3A1878", padding: "12px 16px", display: "flex", gap: 8 }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && send()}
            placeholder={t.chatPlaceholder}
            style={{ flex: 1, padding: "10px 14px", borderRadius: 8, border: "2px solid #555", fontSize: 14, fontFamily: "serif", background: "#fff", color: "#111" }}
          />
          <button onClick={send} style={{ background: "#6B2FBE", border: "2px solid #fff", borderRadius: 8, width: 44, height: 44, cursor: "pointer", color: "#fff", fontSize: 18 }}>›</button>
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: 32 }}>
        <PrimaryButton onClick={onNext}>{t.next}</PrimaryButton>
      </div>
      <HelpButton screen="chat" />
    </div>
  );
}
