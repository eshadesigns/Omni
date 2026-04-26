import { callClaude } from "./api";

const MAX_TOKENS = {
  chat: 400,
  simulation: 1200,
  final: 800,
};

function cleanJson(text) {
  if (!text) return "";

  // extract first JSON object (handles Claude extra text)
  const match = text.match(/\{[\s\S]*\}/);
  if (match) return match[0];

  return text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();
}

function parseJson(text) {
  try {
    return JSON.parse(cleanJson(text));
  } catch (err) {
    console.error("[AI JSON PARSE ERROR]", err);
    console.log("[RAW AI OUTPUT]", text);
    return null;
  }
}

function profileSummary(profile) {
  return [
    `Grade level: ${profile.gradeLevel || "unknown"}`,
    `Academic level: ${profile.academicLevel || "unknown"}`,
    `Primary interests: ${profile.interests || "unknown"}`,
    `Preference: ${
      profile.preferenceWeight === "competitive"
        ? "maximize college competitiveness"
        : profile.preferenceWeight === "low_stress"
        ? "avoid heavy stress"
        : profile.preferenceWeight || "balanced"
    }`,
    `Intent: ${profile.intent || "not specified"}`,
  ].join("\n");
}

function historySummary(history = []) {
  if (!history.length) return "No conversation history yet.";

  return history
    .map(
      (m) =>
        `${m.role === "user" ? "Parent" : "Omni"}: ${m.content}`
    )
    .join("\n");
}

function screenInputsSummary(inputs = {}) {
  if (!Object.keys(inputs).length) return "No additional inputs.";
  return JSON.stringify(inputs);
}

function validateChatResponse(result) {
  if (!result || typeof result !== "object") return { error: "bad_chat" };

  if (typeof result.message !== "string") {
    return { error: "bad_chat_schema" };
  }

  return result;
}

function validateSimulationResponse(result) {
  const paths = ["competitive", "balanced", "focused"];

  if (!result || typeof result !== "object") {
    return { error: "bad_simulation" };
  }

  for (const p of paths) {
    if (!result[p]) return { error: `missing_${p}` };
  }

  return result;
}

function validateFinalResponse(result) {
  if (!result || typeof result !== "object") {
    return { error: "bad_final" };
  }

  return result;
}

function buildPrompt(mode, profile, history, screenInputs, lang) {
  const langNote =
    lang === "es" ? "Respond ONLY in Spanish." : "Respond ONLY in English.";

  if (mode === "chat") {
    return `${langNote}
You are Omni, an educational advisor.

Return ONLY valid JSON:
{
  "message": "reply",
  "followups": ["q1", "q2"]
}

PROFILE:
${profile}

HISTORY:
${history}

INPUTS:
${screenInputs}
`;
  }

  if (mode === "simulation") {
    return `${langNote}

CRITICAL RULE:
Return ONLY a JSON object.
No text before or after.
No markdown.
Start with { and end with }.

You generate 3 academic paths.

FORMAT:
{
  "competitive": {
    "courses": "...",
    "testing": "...",
    "extracurriculars": "...",
    "collegeRange": "...",
    "summary": "...",
    "metrics": {
      "effort": "High",
      "stress": "High",
      "competitiveness": "High",
      "flexibility": "Medium",
      "cost": "Medium"
    }
  },
  "balanced": { "courses": "...", "testing": "...", "extracurriculars": "...", "collegeRange": "...", "summary": "...", "metrics": { "effort": "...", "stress": "...", "competitiveness": "...", "flexibility": "...", "cost": "..." } },
  "focused": { "courses": "...", "testing": "...", "extracurriculars": "...", "collegeRange": "...", "summary": "...", "metrics": { "effort": "...", "stress": "...", "competitiveness": "...", "flexibility": "...", "cost": "..." } }
}

PROFILE:
${profile}

HISTORY:
${history}

INPUTS:
${screenInputs}

Return ONLY JSON.
`;
  }

  return `${langNote}

Return ONLY JSON:
{
  "summary": "...",
  "recommendedPath": "competitive|balanced|focused",
  "actionSteps": ["...", "...", "..."]
}

PROFILE:
${profile}

HISTORY:
${history}

INPUTS:
${screenInputs}
`;
}

export async function generate({ mode, context, lang = "en" }) {
  const profile = profileSummary(context.userProfile || {});
  const history = historySummary(context.conversationHistory || []);
  const inputs = screenInputsSummary(context.currentScreenInputs || {});

  const prompt = buildPrompt(mode, profile, history, inputs, lang);

  const raw = await callClaude(prompt, lang, MAX_TOKENS[mode]);

  if (!raw) {
    return { error: "no_response" };
  }

  const parsed = parseJson(raw);

  if (!parsed) {
    return {
      error: "invalid_json",
      raw, // IMPORTANT for debugging
    };
  }

  if (mode === "chat") return validateChatResponse(parsed);
  if (mode === "simulation") return validateSimulationResponse(parsed);
  return validateFinalResponse(parsed);
}

export async function answerHelpQuestion(question, screen, lang = "en") {
  const prompt = `
Return ONLY JSON:
{
  "message": "answer"
}

Question: ${question}
Screen: ${screen}
`;

  const raw = await callClaude(prompt, lang, 250);
  const parsed = parseJson(raw);

  return parsed?.message || "Could you rephrase that?";
}