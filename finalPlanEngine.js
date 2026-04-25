// src/engines/finalPlanEngine.js
// ─────────────────────────────────────────────
// Generates the final plan summary: decisions made, next milestone, 90-day focus.
// ─────────────────────────────────────────────

import { callClaudeJSON } from "./api";

const FALLBACK = {
  decisions: "Enrolled in Honors Math track, prioritized STEM extracurriculars, planned SAT prep starting sophomore year",
  milestone: "Register for Honors Pre-Calculus before the course selection deadline (usually March–April). An A in this class unlocks the AP Calculus track.",
  focus: "1. Schedule a meeting with the school counselor to confirm course options. 2. Research 2–3 local math or STEM clubs to join this semester. 3. Download the College Board's AP Course Ledger to preview available APs at your school.",
};

/**
 * @param {object} userState
 * @param {string} lang
 * @returns {Promise<object>} - { decisions, milestone, focus }
 */
export async function generateFinalPlan(userState, lang) {
  const prompt = `
You are Omni, a school decision advisor for parents. Based on a parent's choices throughout the app, generate a personalized final plan.

Student profile:
- Grade level: ${userState.gradeLevel}
- Academic level: ${userState.academicLevel}
- Interests: ${userState.interests}
- Preference: ${userState.preferenceWeight === "competitive" ? "Maximize college competitiveness" : "Avoid heavy stress"}
- Additional context from chat: ${userState.chatContext || "none provided"}

Return ONLY valid JSON, no markdown:
{
  "decisions": "3–4 specific key decisions this family made, written as commitments (e.g., 'Honors Math track starting 9th grade')",
  "milestone": "The single most important next action with a concrete deadline or timing (1–2 sentences, very specific)",
  "focus": "3 numbered, concrete action items for the next 90 days — each should be doable by a parent today"
}
`;

  try {
    return await callClaudeJSON(prompt, lang, 600);
  } catch (err) {
    console.warn("[finalPlanEngine] Falling back to static data:", err.message);
    return FALLBACK;
  }
}
