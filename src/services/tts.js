//tts.js
/*
const ELEVEN_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;
const VOICE_ID = import.meta.env.VITE_ELEVENLABS_VOICE_ID;

export async function speakWithElevenLabs(text) {
  if (!text) return false;

  if (!ELEVEN_API_KEY || !VOICE_ID) {
    console.error("Missing ElevenLabs env vars");
    return false;
  }

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": ELEVEN_API_KEY,
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

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[ElevenLabs API ERROR]", errorText);
      throw new Error(errorText);
    }

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);

    const audio = new Audio(audioUrl);

    await audio.play().catch((err) => {
      console.error("[Audio Play Blocked]", err);
    });

    return new Promise((resolve) => {
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        resolve(true);
      };
    });

  } catch (err) {
    console.error("[ElevenLabs TTS ERROR]", err);
    return false;
  }
}*/