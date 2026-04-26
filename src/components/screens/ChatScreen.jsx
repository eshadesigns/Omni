import { useState, useEffect, useRef } from "react";
import { useApp } from "../../context/AppContext";
import { useTranslation } from "../../utils/translations";
import { LanguageToggle, HelpButton, BackButton, PrimaryButton } from "../ui";
import { generate } from "../../services/aiService";

function buildWelcomeMessage(userState, lang) {
  if (lang === "es") {
    return `¡Hola! Soy Omni. Revisé el perfil de tu hijo — ${userState.gradeLevel || "nivel escolar"}, nivel académico ${userState.academicLevel || "no especificado"}, con interés en ${userState.interests || "estudios generales"}. ¿Hay algo específico que quieras que considere, o algo que me preocupe que no haya mencionado todavía?`;
  }
  return `Hi! I'm Omni. I've reviewed your child's profile — ${userState.gradeLevel || "grade not set"}, ${userState.academicLevel || "academic level not set"}, interested in ${userState.interests || "general studies"}. Is there anything specific you'd like me to factor in, or anything about your child I should know that you haven't mentioned yet?`;
}

export default function ChatScreen({ onNext, onBack }) {
  const { lang, userState, updateState } = useApp();
  const t = useTranslation();

  const [messages, setMessages] = useState(
    userState?.chatHistory?.length
      ? userState.chatHistory
      : [
          {
            role: "assistant",
            content: buildWelcomeMessage(userState, lang),
          },
        ]
  );
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const chatRef = useRef(null);

  useEffect(() => {
    if (!userState) return;

    if (!userState.chatHistory || !userState.chatHistory.length) {
      const welcome = [
        {
          role: "assistant",
          content: buildWelcomeMessage(userState, lang),
        },
      ];
      setMessages(welcome);
      updateState({ chatHistory: welcome });
    }
  }, [userState, lang, updateState]);

  async function send() {
    if (!input.trim() || loading) return;

    const userMsg = { role: "user", content: input };
    const updated = [...messages, userMsg];

    setMessages(updated);
    setInput("");
    setLoading(true);
    setError(null);

    updateState({ chatHistory: updated });

    try {
      const result = await generate({
        mode: "chat",
        context: {
          userProfile: userState,
          conversationHistory: updated,
          currentScreenInputs: {},
        },
        lang,
      });

      if (result.error) {
        setError(result.reason || (lang === "en" ? "Something went wrong. Try again." : "Algo salió mal. Intenta de nuevo."));
      } else {
        const assistantMessage = { role: "assistant", content: result.message };
        const nextMessages = [...updated, assistantMessage];
        setMessages(nextMessages);
        updateState({ chatHistory: nextMessages });
      }
    } catch (err) {
      console.error(err);
      setError(lang === "en" ? "Something went wrong. Try again." : "Algo salió mal. Intenta de nuevo.");
    }

    setLoading(false);

    setTimeout(() => {
      chatRef.current?.scrollTo(0, 99999);
    }, 50);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#6B2FBE", padding: 32 }}>
      <LanguageToggle />
      <BackButton onClick={onBack} label={t.back} />

      <h2 style={{ color: "#F4C14F", fontFamily: "serif", marginTop: 16 }}>
        {t.chatTitle}
      </h2>

      <div
        ref={chatRef}
        style={{
          maxWidth: 900,
          margin: "20px auto",
          height: 320,
          overflowY: "auto",
          background: "#4A2090",
          padding: 16,
          borderRadius: 12,
        }}
      >
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              textAlign: m.role === "user" ? "right" : "left",
              marginBottom: 10,
            }}
          >
            <span
              style={{
                display: "inline-block",
                padding: "10px 14px",
                borderRadius: 10,
                background: m.role === "user" ? "#F4C14F" : "#fff",
              }}
            >
              {m.content}
            </span>
          </div>
        ))}

        {loading && (
          <div style={{ color: "#fff", fontStyle: "italic" }}>
            {t.generating}
          </div>
        )}
      </div>

      {error && (
        <div style={{ color: "#FFB3B3", maxWidth: 900, margin: "12px auto", fontSize: 14 }}>
          {error}
        </div>
      )}

      <div style={{ display: "flex", gap: 8, maxWidth: 900, margin: "0 auto" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          style={{ flex: 1, padding: 12 }}
          placeholder={t.chatPlaceholder}
        />
        <button onClick={send}>Send</button>
      </div>

      <div style={{ textAlign: "center", marginTop: 24 }}>
        <PrimaryButton onClick={onNext}>{t.next}</PrimaryButton>
      </div>

      <HelpButton screen="chat" />
    </div>
  );
}