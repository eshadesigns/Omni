import { useState, useRef } from "react";
import { useApp } from "../context/AppContext";

/**
 * Simple Voice Coach Hook (NO AI, NO SpeechRecognition)
 * - Only handles playback
 * - Ready for ElevenLabs swap later
 */
export function useVoiceCoach() {
  const { lang } = useApp();

  const [isSpeaking, setIsSpeaking] = useState(false);
  const audioRef = useRef(null);

  /**
   * Basic browser TTS fallback (temporary)
   * You will replace THIS with ElevenLabs in FinalScreen later
   */
  const speak = async (text) => {
    if (!text) return;

    stop(); // cancel previous

    setIsSpeaking(true);

    // fallback TTS (temporary until ElevenLabs)
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === "es" ? "es-ES" : "en-US";
    utterance.rate = 0.95;

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  /**
   * Stop speech immediately
   */
  const stop = () => {
    window.speechSynthesis.cancel();

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    setIsSpeaking(false);
  };

  return {
    speak,
    stop,
    isSpeaking,
  };
}