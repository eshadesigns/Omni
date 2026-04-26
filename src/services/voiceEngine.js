// voiceEngine.js (SINGLE SOURCE OF TRUTH)

const ELEVEN_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;
const VOICE_ID = import.meta.env.VITE_ELEVENLABS_VOICE_ID;

let currentAudio = null;

/* ─────────────────────────────
   LANGUAGE HANDLING
───────────────────────────── */

function getBrowserLang(lang) {
  if (lang === "es") return "es-ES";
  return "en-US";
}

/* ─────────────────────────────
   ELEVENLABS (PRIMARY)
───────────────────────────── */

async function speakElevenLabs(text) {
  if (!ELEVEN_API_KEY || !VOICE_ID) {
    throw new Error("Missing ElevenLabs API key or voice ID");
  }

  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": ELEVEN_API_KEY,
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.45,
          similarity_boost: 0.8,
        },
      }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err);
  }

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);

  const audio = new Audio(url);
  currentAudio = audio;

  return new Promise((resolve, reject) => {
    audio.onended = () => {
      URL.revokeObjectURL(url);
      currentAudio = null;
      resolve();
    };

    audio.onerror = (e) => {
      URL.revokeObjectURL(url);
      currentAudio = null;
      reject(e);
    };

    audio.play().catch((err) => {
      URL.revokeObjectURL(url);
      currentAudio = null;
      reject(err);
    });
  });
}

/* ─────────────────────────────
   BROWSER FALLBACK (SPANISH WORKS HERE)
───────────────────────────── */

function speakBrowser(text, lang) {
  return new Promise((resolve) => {
    if (currentAudio) {
      currentAudio.pause?.();
      currentAudio = null;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = getBrowserLang(lang);

    const voices = speechSynthesis.getVoices();
    const voice =
      voices.find((v) => v.lang.includes(lang === "es" ? "es" : "en")) ||
      voices[0];

    if (voice) utterance.voice = voice;

    utterance.onend = resolve;
    utterance.onerror = resolve;

    speechSynthesis.speak(utterance);
  });
}

/* ─────────────────────────────
   PUBLIC API (USE THIS ONLY)
───────────────────────────── */

export async function speak(text, lang = "en") {
  if (!text) return;

  try {
    await speakElevenLabs(text);
  } catch (err) {
    console.warn("[Voice fallback triggered]", err);
    await speakBrowser(text, lang);
  }
}