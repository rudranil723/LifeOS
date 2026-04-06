// Quick test: does your Gemini API key work at all?
const key = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
console.log("Key loaded:", key ? `${key.substring(0,10)}...${key.substring(key.length-4)}` : "NOT SET");
console.log("Key length:", key?.length);

const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${key}`;
console.log("Calling:", url.replace(key, "***"));

const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), 15000);

try {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents: [{ parts: [{ text: "Say hello" }] }] }),
    signal: controller.signal,
  });
  clearTimeout(timeout);
  console.log("HTTP Status:", res.status);
  const body = await res.text();
  console.log("Response:", body.substring(0, 600));
} catch (e) {
  clearTimeout(timeout);
  console.error("FAILED:", e.name, e.message);
}
