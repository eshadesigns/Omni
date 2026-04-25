// src/engines/api.js
// ─────────────────────────────────────────────
// Single source of truth for all Claude API calls.
// API key and model are read from environment variables — never hardcoded.
// ─────────────────────────────────────────────

const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;
const MODEL   = import.meta.env.VITE_CLAUDE_MODEL || "claude-sonnet-4-20250514";
const DEBUG   = import.meta.env.VITE_DEBUG_API === "true";

if (!API_KEY) {
  console.error(
    "[Omni] VITE_ANTHROPIC_API_KEY is not set.\n" +
    "Copy .env.example → .env and add your key."
  );
}

/**
 * Core fetch wrapper. All engine functions go through here.
 * @param {string} userPrompt  - The full prompt to send
 * @param {string} lang        - "en" | "es"
 * @param {number} maxTokens   - defaults to 1000
 * @returns {Promise<string>}  - The text response
 */
export async function callClaude(userPrompt, lang = "en", maxTokens = 1000) {
  const langNote = lang === "es"
    ? "Respond entirely in Spanish."
    : "Respond in English.";

  const body = {
    model: MODEL,
    max_tokens: maxTokens,
    messages: [{ role: "user", content: `${langNote}\n\n${userPrompt}` }],
  };

  if (DEBUG) {
    console.group("[Omni API] callClaude");
    console.log("model:", MODEL);
    console.log("lang:", lang);
    console.log("prompt:", userPrompt.slice(0, 200) + "…");
    console.groupEnd();
  }

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const err = await response.text();
    console.error("[Omni API] error:", response.status, err);
    throw new Error(`API error ${response.status}`);
  }

  const data = await response.json();
  return data.content?.[0]?.text ?? "";
}

/**
 * Wrapper that parses JSON from Claude's response.
 * Strips markdown fences if present.
 */
export async function callClaudeJSON(userPrompt, lang = "en", maxTokens = 1000) {
  const raw = await callClaude(userPrompt, lang, maxTokens);
  const clean = raw.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}
