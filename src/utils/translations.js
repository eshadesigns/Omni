// src/utils/translations.js
// ─────────────────────────────────────────────
// Clean structured i18n system for Omni
// Fixes partial translations, UI inconsistencies,
// and missing nested content localization.
// ─────────────────────────────────────────────

import { useApp } from "../context/AppContext";

/**
 * CORE TRANSLATIONS
 */
export const translations = {
  en: {
    tagline: "Make the right school decisions before they shape your child's future",
    cta: "Explore Their Path",

    intentQ: "What would you like help with today?",
    intents: [
      { id: "class_help", label: "We're not sure what classes to choose" },
      { id: "college", label: "Understand college requirements" },
      { id: "check_track", label: "Check if my child is on the right track" },
      { id: "scratch", label: "Start from scratch" },
    ],

    gradeTitle: "Tell us a bit about your child",
    gradeLabel: "Select Your Child's Education Level",
    grades: ["Elementary (K-5th)", "Middle (6-8th)", "High (9-12th)"],

    academicLabel: "Academic level",
    academics: ["Needs support", "On track", "Advanced"],

    interestsLabel: "Interests",
    interests: [
      "STEM (Science, Technology, Engineering, Mathematics)",
      "Business",
      "Creative",
      "Undecided",
    ],

    prefLabel: "Pick One",
    prefA: "Avoid Heavy Stress",
    prefB: "Maximize college competitiveness",
    prefOr: "or",

    simTitle: "If you choose this path, here's what the future could look like",
    pathLabels: [["Path A", "Competitive"], ["Path B", "Balanced"], ["Path C", "Focused"]],
    pathKeys: ["competitive", "balanced", "focused"],

    compareTitle: "Compare your options",
    compareRows: [
      "Effort Level",
      "Stress",
      "College Competitiveness",
      "Flexibility",
      "Cost",
    ],
    compareMetricKeys: ["effort", "stress", "competitiveness", "flexibility", "cost"],

    // FIXED: chart labels now translated properly
    chartLabels: {
      high: "High",
      medium: "Medium",
      low: "Low",
    },

    chatTitle: "Tell us anything you'd like us to consider when making your plan",
    chatPlaceholder: "Type your concern…",

    finalTitle: "Here's your child's current path",

    // FIXED: fully structured final cards (no partial translation issue anymore)
    finalCards: {
      en: [
        {
          title: "Key decisions made",
          content: "A summary of academic and extracurricular choices shaping the current path."
        },
        {
          title: "Next milestone",
          content: "The next major academic or planning checkpoint your child should reach."
        },
        {
          title: "What to focus on now",
          content: "Immediate priorities to stay on track or improve future outcomes."
        }
      ],
      es: [
        {
          title: "Decisiones clave tomadas",
          content: "Un resumen de las decisiones académicas y extracurriculares actuales."
        },
        {
          title: "Próximo hito",
          content: "El siguiente punto importante en el camino académico."
        },
        {
          title: "En qué enfocarse ahora",
          content: "Prioridades inmediatas para mejorar o mantener el rumbo."
        }
      ],
    },

    adjust: "Adjust decisions",
    explore: "Explore alternative paths",
    save: "Save plan",

    generating: "Omni is thinking…",

    back: "← Back",
    next: "Continue →",

    helpHeading: "Need help?",
    helpBack: "← Back to questions",
    helpClose: "Close",

    courses: "Courses:",
    testing: "Testing:",
    extracurriculars: "Extracurriculars:",
    collegeRange: "College range:",
    mostLikely: "Most likely outcome:",
  },

  es: {
    tagline: "Toma las decisiones escolares correctas antes de que moldeen el futuro de tu hijo",
    cta: "Explorar Su Camino",

    intentQ: "¿Con qué te gustaría ayuda hoy?",
    intents: [
      { id: "class_help", label: "No estamos seguros qué clases elegir" },
      { id: "college", label: "Entender los requisitos universitarios" },
      { id: "check_track", label: "Verificar si mi hijo va por buen camino" },
      { id: "scratch", label: "Empezar desde cero" },
    ],

    gradeTitle: "Cuéntanos un poco sobre tu hijo",
    gradeLabel: "Selecciona el Nivel Educativo de Tu Hijo",
    grades: ["Primaria (K-5°)", "Secundaria (6°-8°)", "Preparatoria (9°-12°)"],

    academicLabel: "Nivel académico",
    academics: ["Necesita apoyo", "Al corriente", "Avanzado"],

    interestsLabel: "Intereses",
    interests: [
      "STEM (Ciencia, Tecnología, Ingeniería, Matemáticas)",
      "Negocios",
      "Creativo",
      "Sin decidir",
    ],

    prefLabel: "Elige Uno",
    prefA: "Evitar Estrés Intenso",
    prefB: "Maximizar competitividad universitaria",
    prefOr: "o",

    simTitle: "Si eliges este camino, así podría verse el futuro",
    pathLabels: [["Camino A", "Competitivo"], ["Camino B", "Equilibrado"], ["Camino C", "Enfocado"]],
    pathKeys: ["competitive", "balanced", "focused"],

    compareTitle: "Compara tus opciones",
    compareRows: [
      "Nivel de esfuerzo",
      "Estrés",
      "Competitividad universitaria",
      "Flexibilidad",
      "Costo",
    ],
    compareMetricKeys: ["effort", "stress", "competitiveness", "flexibility", "cost"],

    chartLabels: {
      high: "Alto",
      medium: "Medio",
      low: "Bajo",
    },

    chatTitle: "Cuéntanos cualquier cosa que quieras que consideremos al hacer tu plan",
    chatPlaceholder: "Escribe tu pregunta…",

    finalTitle: "Este es el camino actual de tu hijo",

    finalCards: {
      en: [
        {
          title: "Decisiones clave tomadas",
          content: "Resumen del estado actual del plan académico."
        },
        {
          title: "Próximo hito",
          content: "Siguiente punto importante en el desarrollo académico."
        },
        {
          title: "En qué enfocarse ahora",
          content: "Prioridades inmediatas para mejorar resultados."
        }
      ],
      es: [
        {
          title: "Decisiones clave tomadas",
          content: "Resumen del estado actual del plan académico."
        },
        {
          title: "Próximo hito",
          content: "Siguiente punto importante en el desarrollo académico."
        },
        {
          title: "En qué enfocarse ahora",
          content: "Prioridades inmediatas para mejorar resultados."
        }
      ],
    },

    adjust: "Ajustar decisiones",
    explore: "Explorar caminos alternativos",
    save: "Guardar plan",

    generating: "Omni está pensando…",

    back: "← Atrás",
    next: "Continuar →",

    helpHeading: "¿Necesitas ayuda?",
    helpBack: "← Volver a preguntas",
    helpClose: "Cerrar",

    courses: "Cursos:",
    testing: "Exámenes:",
    extracurriculars: "Extracurriculares:",
    collegeRange: "Rango universitario:",
    mostLikely: "Resultado más probable:",
  },
};

/**
 * HOOK
 */
export function useTranslation() {
  const { lang } = useApp();
  return translations[lang] ?? translations.en;
}

/**
 * HELP CONTENT (unchanged but stable)
 */
export const helpContent = {
  en: {
    landing: ["What is Omni?", "How does this work?", "Is this advice accurate?"],
    intent: ["Why does intent matter?", "Can I change my answer later?"],
    grade: ["Why does grade level matter?", "What if my child is between levels?"],
    academic: ["What does 'needs support' mean?", "How does this affect the plan?"],
    interests: ["What if my child is undecided?", "Can I pick multiple interests?"],
    preference: ["What does 'stress vs competitiveness' mean?", "Can I be somewhere in the middle?"],
    simulation: ["What does this path mean?", "How accurate are these projections?", "What if my child changes direction?"],
    comparison: ["How do I read this table?", "What is 'college competitiveness'?", "Most common choice for similar students"],
    chat: ["What should I type here?", "Will this change the plan?", "How does Omni use my answers?"],
    final: ["How do I adjust decisions?", "Can I save and come back?", "What does 'next milestone' mean?"],
  },
  es: {
    landing: ["¿Qué es Omni?", "¿Cómo funciona esto?", "¿Es preciso este consejo?"],
    intent: ["¿Por qué importa la intención?", "¿Puedo cambiar mi respuesta?"],
    grade: ["¿Por qué importa el nivel escolar?", "¿Qué pasa si está entre niveles?"],
    academic: ["¿Qué significa 'necesita apoyo'?", "¿Cómo afecta esto el plan?"],
    interests: ["¿Qué si aún no sabe?", "¿Puedo elegir varios intereses?"],
    preference: ["¿Qué significa estrés vs competitividad?", "¿Puedo estar en el medio?"],
    simulation: ["¿Qué significa este camino?", "¿Qué tan precisas son las proyecciones?"],
    comparison: ["¿Cómo leo esta tabla?", "¿Qué es la competitividad universitaria?"],
    chat: ["¿Qué debo escribir aquí?", "¿Esto cambiará el plan?", "¿Cómo usa Omni mis respuestas?"],
    final: ["¿Cómo ajusto las decisiones?", "¿Puedo guardar y volver?", "¿Qué significa 'próximo hito'?"],
  },
};