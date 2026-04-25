// src/App.jsx
// ─────────────────────────────────────────────
// Root component. Owns screen routing, sim/final data,
// and passes only what each screen needs.
// ─────────────────────────────────────────────

import { useState } from "react";
import { AppProvider, useApp } from "./context/AppContext";
import { generateSimulation } from "./engines/simulationEngine";
import { generateFinalPlan } from "./engines/finalPlanEngine";
import { ProgressBar } from "./components/ui";

// Screens
import LandingScreen    from "./components/screens/LandingScreen";
import IntentScreen     from "./components/screens/IntentScreen";
import GradeScreen      from "./components/screens/GradeScreen";
import AcademicScreen   from "./components/screens/AcademicScreen";
import InterestsScreen  from "./components/screens/InterestsScreen";
import PreferenceScreen from "./components/screens/PreferenceScreen";
import SimulationScreen from "./components/screens/SimulationScreen";
import ComparisonScreen from "./components/screens/ComparisonScreen";
import ChatScreen       from "./components/screens/ChatScreen";
import FinalScreen      from "./components/screens/FinalScreen";

const FLOW = [
  "landing", "intent", "grade", "academic",
  "interests", "preference", "simulation",
  "comparison", "chat", "final",
];

function OmniRouter() {
  const { lang, userState } = useApp();
  const [screen, setScreen]         = useState("landing");
  const [simData, setSimData]       = useState(null);
  const [simLoading, setSimLoading] = useState(false);
  const [finalData, setFinalData]   = useState(null);
  const [finalLoading, setFinalLoading] = useState(false);

  const currentIdx = FLOW.indexOf(screen);

  async function loadSimulation() {
    if (simData) return;
    setSimLoading(true);
    const data = await generateSimulation(userState, lang);
    setSimData(data);
    setSimLoading(false);
  }

  async function loadFinalPlan() {
    setFinalLoading(true);
    const data = await generateFinalPlan(userState, lang);
    setFinalData(data);
    setFinalLoading(false);
  }

  function goTo(target) {
    if (target === "simulation") loadSimulation();
    if (target === "final")      loadFinalPlan();
    setScreen(target);
  }

  function next() { goTo(FLOW[currentIdx + 1]); }
  function back() { setScreen(FLOW[Math.max(0, currentIdx - 1)]); }
  function restart() { setSimData(null); setFinalData(null); setScreen("landing"); }

  const screenProps = { onNext: next, onBack: back };

  return (
    <div style={{ fontFamily: "serif", minHeight: "100vh" }}>
      {screen !== "landing" && <ProgressBar current={currentIdx} total={FLOW.length - 1} />}

      {screen === "landing"    && <LandingScreen    onNext={next} />}
      {screen === "intent"     && <IntentScreen     {...screenProps} />}
      {screen === "grade"      && <GradeScreen      {...screenProps} />}
      {screen === "academic"   && <AcademicScreen   {...screenProps} />}
      {screen === "interests"  && <InterestsScreen  {...screenProps} />}
      {screen === "preference" && <PreferenceScreen {...screenProps} />}
      {screen === "simulation" && <SimulationScreen {...screenProps} simData={simData} loading={simLoading} />}
      {screen === "comparison" && <ComparisonScreen {...screenProps} simData={simData} />}
      {screen === "chat"       && <ChatScreen       {...screenProps} />}
      {screen === "final"      && (
        <FinalScreen
          onBack={back}
          finalData={finalData}
          loading={finalLoading}
          onRestart={restart}
          onRegenerateFinal={loadFinalPlan}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <OmniRouter />
    </AppProvider>
  );
}
