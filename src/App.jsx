// src/App.jsx
// ─────────────────────────────────────────────
// Root component. Owns screen routing, sim/final data,
// and passes only what each screen needs.
// ─────────────────────────────────────────────

import { useState, Component } from "react";
import { AppProvider, useApp } from "./context/AppContext";
import * as aiService from "./services/aiService";
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

class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("[ErrorBoundary]", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: "100vh", padding: 32, fontFamily: "serif", color: "#2C2A64" }}>
          <h1>Something went wrong.</h1>
          <p>Please reload to continue.</p>
          <button
            onClick={() => window.location.reload()}
            style={{ marginTop: 20, padding: "12px 20px", borderRadius: 10, border: "none", background: "#1f60ff", color: "white", cursor: "pointer" }}
          >
            Reload
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

function OmniRouter() {
  const { lang, userState } = useApp();
  const [screen, setScreen]         = useState("landing");
  const [simData, setSimData]       = useState(null);
  const [simLoading, setSimLoading] = useState(false);
  const [simError, setSimError]     = useState(null);
  const [finalData, setFinalData]   = useState(null);
  const [finalLoading, setFinalLoading] = useState(false);
  const [finalError, setFinalError] = useState(null);

  const safeScreen = FLOW.includes(screen) ? screen : "landing";
  const currentIdx = FLOW.indexOf(safeScreen);

  async function loadSimulation() {
    if (simData) return;
    setSimLoading(true);
    setSimError(null);
    try {
      const result = await aiService.generate({
        mode: "simulation",
        context: {
          userProfile: userState || {},
          conversationHistory: userState?.chatHistory || [],
          currentScreenInputs: {},
        },
        lang,
      });

      if (result.error) {
        setSimError(result);
        setSimData(null);
      } else {
        setSimData(result);
      }
    } catch (err) {
      console.error("[App] loadSimulation failed", err);
      setSimError({ error: "unexpected_error", reason: err.message });
      setSimData(null);
    } finally {
      setSimLoading(false);
    }
  }

  async function loadFinalPlan() {
    if (finalData) return;
    setFinalLoading(true);
    setFinalError(null);
    try {
      const result = await aiService.generate({
        mode: "final",
        context: {
          userProfile: userState || {},
          conversationHistory: userState?.chatHistory || [],
          currentScreenInputs: {},
        },
        lang,
      });

      if (result.error) {
        setFinalError(result);
        setFinalData(null);
      } else {
        setFinalData(result);
      }
    } catch (err) {
      console.error("[App] loadFinalPlan failed", err);
      setFinalError({ error: "unexpected_error", reason: err.message });
      setFinalData(null);
    } finally {
      setFinalLoading(false);
    }
  }

  function goTo(target) {
    if (target === "simulation") loadSimulation();
    if (target === "final") loadFinalPlan();
    setScreen(target);
  }

  function next() { goTo(FLOW[currentIdx + 1]); }
  function back() { setScreen(FLOW[Math.max(0, currentIdx - 1)]); }
  function restart() { setSimData(null); setFinalData(null); setScreen("landing"); }

  const screenProps = { onNext: next, onBack: back };

  return (
    <div style={{ fontFamily: "serif", minHeight: "100vh" }}>

      {safeScreen !== "landing" && (
        <ProgressBar current={currentIdx} total={FLOW.length - 1} />
      )}

      {safeScreen === "landing"    && <LandingScreen    onNext={next} />}
      {safeScreen === "intent"     && <IntentScreen     {...screenProps} />}
      {safeScreen === "grade"      && <GradeScreen      {...screenProps} />}
      {safeScreen === "academic"   && <AcademicScreen   {...screenProps} />}
      {safeScreen === "interests"  && <InterestsScreen  {...screenProps} />}
      {safeScreen === "preference" && <PreferenceScreen {...screenProps} />}
      {safeScreen === "simulation" && (
        <SimulationScreen
          {...screenProps}
          simData={simData}
          loading={simLoading}
          error={simError}
          onRetry={loadSimulation}
        />
      )}
      {safeScreen === "comparison" && (
        <ComparisonScreen {...screenProps} simData={simData} />
      )}
      {safeScreen === "chat" && <ChatScreen {...screenProps} />}
      {safeScreen === "final" && (
        <FinalScreen
          onBack={back}
          finalData={finalData}
          loading={finalLoading}
          error={finalError}
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
      <ErrorBoundary>
        <OmniRouter />
      </ErrorBoundary>
    </AppProvider>
  );
}