// src/services/api.js
// ─────────────────────────────────────────────
// Single source of truth for Claude API calls
// + Clean voice coach layer (ElevenLabs-ready)
// ─────────────────────────────────────────────

const API_KEY = import.meta.env.VITE_CLAUDE_API_KEY;
const MODEL =
  import.meta.env.VITE_CLAUDE_MODEL || "claude-sonnet-4-20250514";
const DEBUG = import.meta.env.VITE_DEBUG_API === "true";

if (!API_KEY) {
  console.error("[Omni] Missing VITE_CLAUDE_API_KEY in .env");
}

/* ─────────────────────────────────────────────
   BASE CLAUDE CALL
──────────────────────────────────────────── */

export async function callClaude(userPrompt, lang = "en", maxTokens = 1000) {
  const langNote =
    lang === "es"
      ? "Respond entirely in Spanish."
      : "Respond in English.";

  const body = {
    model: MODEL,
    max_tokens: maxTokens,
    messages: [
      {
        role: "user",
        content: `${langNote}\n\n${userPrompt}`,
      },
    ],
  };

  try {
    if (DEBUG) console.log("[Omni API] request:", body);

    const response = await fetch("http://localhost:3001/api/claude", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("[Omni API error]", err);

      return lang === "en"
        ? "Something went wrong. Please try again."
        : "Algo salió mal. Intenta de nuevo.";
    }

    const data = await response.json();
    return data.content?.[0]?.text ?? "";
  } catch (err) {
    console.error("[Omni API crash]", err);

    return lang === "en"
      ? "Network error. Please try again."
      : "Error de red. Intenta de nuevo.";
  }
}

/* ─────────────────────────────────────────────
   SAFE JSON PARSER
──────────────────────────────────────────── */

export async function callClaudeJSON(
  userPrompt,
  lang = "en",
  maxTokens = 1000
) {
  const raw = await callClaude(userPrompt, lang, maxTokens);

  try {
    return JSON.parse(raw.replace(/```json|```/g, "").trim());
  } catch {
    return {};
  }
}

/* ─────────────────────────────────────────────
   VOICE PROMPT BUILDER (CLEANED)
──────────────────────────────────────────── */

function buildVoiceCoachPrompt(lang, context = "") {
  const langNote =
    lang === "es"
      ? "Speak naturally in Spanish."
      : "Speak naturally in English.";

  return `
You are a real human educational advisor speaking to a parent.

RULES:
- Speak like a real advisor on a phone call
- Keep responses short but complete (~30–60 seconds spoken)
- Ask occasional follow-up questions
- Do NOT use bullet points or lists
- Explain terms naturally when they appear
- Stay conversational and calm
- Focus on clarity over detail overload

${langNote}

Context (structured):
${
  typeof context === "object"
    ? JSON.stringify(context, null, 2)
    : context || "No prior context"
}
`;
}

/* ─────────────────────────────────────────────
   VOICE COACH (FINAL CLEAN VERSION)
──────────────────────────────────────────── */

export async function callClaudeVoice(userText, lang = "en", context = "") {
  const prompt = `
${buildVoiceCoachPrompt(lang, context)}

User said:
"${userText}"
`;

  return await callClaude(prompt, lang, 700);
}