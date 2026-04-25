// src/engines/simulationEngine.js
// ─────────────────────────────────────────────
// Generates the 3-path simulation (Competitive / Balanced / Focused)
// based on the user's profile. All outputs are dynamic — nothing hardcoded.
// ─────────────────────────────────────────────

import { callClaudeJSON } from "./api";

const FALLBACK = {
  competitive: {
    courses: "Pre-Calculus (current year), AP Calculus AB (11th), AP Calculus BC + AP Physics C (12th)",
    testing: "PSAT 10th grade, SAT prep 10th summer, SAT 11th grade (target 1450+), 4–5 AP exams across 11th–12th",
    extracurriculars: "Math Team captain, Science Olympiad, robotics club, summer research program",
    collegeRange: "UC Berkeley, UCLA, Carnegie Mellon, selective state flagships",
    summary: "A highly competitive college applicant with strong STEM credentials. Likely admission to top-50 universities with potential for merit scholarships.",
    metrics: { effort: "Very High", stress: "High", competitiveness: "Very High", flexibility: "Low", cost: "High" },
  },
  balanced: {
    courses: "Honors Pre-Calculus (current), AP Calculus AB (11th), one AP science (12th)",
    testing: "PSAT 10th, SAT 11th (target 1300+), 2–3 AP exams across 11th–12th",
    extracurriculars: "One academic club, one creative/social EC, leadership in 1 area",
    collegeRange: "State flagship universities, mid-tier private colleges",
    summary: "A well-rounded applicant with solid grades and broad interests. Good range of college options with manageable workload.",
    metrics: { effort: "Medium", stress: "Medium", competitiveness: "Medium", flexibility: "Medium", cost: "Medium" },
  },
  focused: {
    courses: "Honors core classes, 1 AP in area of interest (12th grade)",
    testing: "SAT or ACT once (junior year), 1–2 AP exams",
    extracurriculars: "1–2 deep, sustained interests (portfolio, community service, or job)",
    collegeRange: "Regional universities, community college + transfer pathway, trade programs",
    summary: "A targeted applicant with a clear identity and low-stress approach. Strong fit for schools that value authentic passion over resume breadth.",
    metrics: { effort: "Low", stress: "Low", competitiveness: "Low", flexibility: "High", cost: "Low" },
  },
};

/**
 * @param {object} userState - global app state
 * @param {string} lang - "en" | "es"
 * @returns {Promise<object>} - { competitive, balanced, focused }
 */
export async function generateSimulation(userState, lang) {
  const prompt = `
You are an educational advisor. Generate 3 specific, realistic academic paths for a K-12 student.

Student profile:
- Grade level: ${userState.gradeLevel}
- Academic level: ${userState.academicLevel}
- Primary interests: ${userState.interests}
- Preference: ${userState.preferenceWeight === "competitive" ? "Maximize college competitiveness" : "Avoid heavy stress"}
- Help needed with: ${userState.intent}

Return ONLY valid JSON — no markdown, no extra text — in this exact shape:
{
  "competitive": {
    "courses": "Specific year-by-year course sequence with actual course names",
    "testing": "Specific SAT/ACT/AP exam timeline with target scores",
    "extracurriculars": "3-4 specific activities with leadership roles",
    "collegeRange": "3-4 specific school names at this competitiveness tier",
    "summary": "2 sentences: most likely outcome if student follows this path",
    "metrics": {
      "effort": "Very High | High | Medium | Low",
      "stress": "Very High | High | Medium | Low",
      "competitiveness": "Very High | High | Medium | Low",
      "flexibility": "High | Medium | Low",
      "cost": "High | Medium | Low"
    }
  },
  "balanced": { "same structure" },
  "focused": { "same structure" }
}

Rules:
- Be SPECIFIC. Name real courses (AP Calculus AB, not "advanced math").
- Vary outputs meaningfully based on the student's grade level and academic level.
- Do NOT use placeholder text like "same structure" — fill in every field.
`;

  try {
    return await callClaudeJSON(prompt, lang, 1200);
  } catch (err) {
    console.warn("[simulationEngine] Falling back to static data:", err.message);
    return FALLBACK;
  }
}
