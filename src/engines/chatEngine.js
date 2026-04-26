// src/engines/chatEngine.js
// ─────────────────────────────────────────────
// Handles the conversational chatbot refinement system.
// ─────────────────────────────────────────────

import { callClaude } from "../services/api";

/**
 * Builds the system context string for the chat.
 */
function buildSystemContext(userState) {
  return `You are Omni, an intelligent educational advisor helping parents make academic decisions for their child.

Student profile:
- Grade: ${userState.gradeLevel || "not specified"}
- Academic level: ${userState.academicLevel || "not specified"}
- Interests: ${userState.interests || "not specified"}
- Preference: ${userState.preferenceWeight === "competitive" ? "maximize college competitiveness" : "avoid heavy stress"}

Your role:
- Ask targeted follow-up questions to refine recommendations
- Identify uncertainty or gaps in the profile
- Explain how each answer changes the child's path
- Be warm, specific, and non-judgmental
- Keep responses under 120 words
- Always end with ONE clarifying question`;
}

/**
 * Generates the initial greeting message based on the user's profile.
 */
export function buildWelcomeMessage(userState, lang) {
  if (lang === "es") {
    return `¡Hola! Soy Omni. Revisé el perfil de tu hijo — ${userState.gradeLevel || "nivel escolar"}, ` +
      `nivel académico ${userState.academicLevel || "no especificado"}, con interés en ${userState.interests || "estudios generales"}. ` +
      `¿Hay algo específico que quieras que considere, o algo que me preocupe que no haya mencionado todavía?`;
  }
  return `Hi! I'm Omni. I've reviewed your child's profile — ${userState.gradeLevel || "grade not set"}, ` +
    `${userState.academicLevel || "academic level not set"}, interested in ${userState.interests || "general studies"}. ` +
    `Is there anything specific you'd like me to factor in, or anything about your child I should know that you haven't mentioned yet?`;
}

/**
 * Sends a user message and returns the assistant's reply.
 * @param {string[]} conversationHistory - Array of {role, content} objects
 * @param {object} userState
 * @param {string} lang
 */
export async function sendChatMessage(conversationHistory, userState, lang) {
  const context = buildSystemContext(userState);
  const history = conversationHistory
    .map(m => `${m.role === "user" ? "Parent" : "Omni"}: ${m.content}`)
    .join("\n");

  const prompt = `${context}\n\nConversation so far:\n${history}\n\nNow respond as Omni:`;

  return callClaude(prompt, lang, 300);
}

/**
 * Answers a contextual help question about the app.
 * @param {string} question
 * @param {string} screen - current screen name
 * @param {string} lang
 */
export async function answerHelpQuestion(question, screen, lang) {
  const prompt = `You are Omni, a friendly educational advisor inside a school planning app for parents.
A parent clicked the help button on the "${screen}" screen and asked: "${question}"
Answer in 2–3 sentences. Be clear, reassuring, and specific. Do not mention that you are an AI.`;

  return callClaude(prompt, lang, 200);
}
