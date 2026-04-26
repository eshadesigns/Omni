/*const API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;
const VOICE_ID = import.meta.env.VITE_ELEVENLABS_VOICE_ID;


 // Convert text → ElevenLabs audio → play it

export async function speakWithElevenLabs(text) {
  if (!text) return;

  const url = `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "xi-api-key": API_KEY,
      "Accept": "audio/mpeg",
    },
    body: JSON.stringify({
      text,
      model_id: "eleven_multilingual_v2", // supports Spanish + English
      voice_settings: {
        stability: 0.4,
        similarity_boost: 0.8,
      },
    }),
  });

  if (!response.ok) {
    console.error("ElevenLabs failed:", await response.text());
    return;
  }

  const audioBlob = await response.blob();
  const audioUrl = URL.createObjectURL(audioBlob);

  const audio = new Audio(audioUrl);
  audio.play();

  return new Promise((resolve) => {
    audio.onended = resolve;
  });
}*/