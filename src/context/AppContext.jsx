// src/context/AppContext.jsx
// ─────────────────────────────────────────────
// Global state for the entire Omni app.
// All screens read from here — no prop drilling.
// ─────────────────────────────────────────────

import { createContext, useContext, useState } from "react";

const EMPTY_APP_CONTEXT = {
  lang: "en",
  setLang: () => {},
  userState: {
    intent: null,
    gradeLevel: null,
    academicLevel: null,
    interests: null,
    preferenceWeight: null,
    chatHistory: [],
  },
  updateState: () => {},
  resetState: () => {},
};

export const AppContext = createContext(EMPTY_APP_CONTEXT);

export const INITIAL_STATE = {
  intent: null,           // "class_help" | "college" | "check_track" | "scratch"
  gradeLevel: null,       // "Elementary (K-5th)" | "Middle (6-8th)" | "High (9-12th)"
  academicLevel: null,    // "Needs support" | "On track" | "Advanced"
  interests: null,        // "STEM" | "Business" | "Creative" | "Undecided"
  preferenceWeight: null, // "low_stress" | "competitive"
  chatHistory: [],        // full chat conversation for AI context
};

export function AppProvider({ children }) {
  const [lang, setLang] = useState("en");
  const [userState, setUserState] = useState(INITIAL_STATE);

  function updateState(partial) {
    setUserState(prev => ({ ...prev, ...partial }));
  }

  function resetState() {
    setUserState(INITIAL_STATE);
  }

  return (
    <AppContext.Provider value={{ lang, setLang, userState, updateState, resetState }}>
      {children}
    </AppContext.Provider>
  );
}

/** Convenience hook — throws if used outside AppProvider */
export function useApp() {
  const ctx = useContext(AppContext);

  if (!ctx) {
    throw new Error("AppContext is missing. Make sure AppProvider wraps the app.");
  }

  return ctx;
}
