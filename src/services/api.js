// src/services/api.js
// ─────────────────────────────────────────────
// Single source of truth for Claude API calls
// FIXED: correct Anthropic headers + safer error handling
// ─────────────────────────────────────────────

const API_KEY = import.meta.env.VITE_CLAUDE_API_KEY;
const MODEL = import.meta.env.VITE_CLAUDE_MODEL || "claude-sonnet-4-20250514";
const DEBUG = import.meta.env.VITE_DEBUG_API === "true";

if (!API_KEY) {
  console.error("[Omni] Missing VITE_CLAUDE_API_KEY in .env");
}

export async function callClaude(userPrompt, lang = "en", maxTokens = 1000) {
  const langNote =
    lang === "es" ? "Respond entirely in Spanish." : "Respond in English.";

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
    if (DEBUG) {
      console.log("[Omni API] request:", body);
    }

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

export async function callClaudeJSON(userPrompt, lang = "en", maxTokens = 1000) {
  const raw = await callClaude(userPrompt, lang, maxTokens);
  try {
    return JSON.parse(raw.replace(/```json|```/g, "").trim());
  } catch {
    return {};
  }
}