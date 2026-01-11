// server/controllers/aiController.js
import "dotenv/config";
import OpenAI from "openai";
import { MODE_PROMPTS } from "../prompts/modes.js";

function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "Missing OPENAI_API_KEY. Add it to server/.env (OPENAI_API_KEY=...) and restart."
    );
  }
  return new OpenAI({ apiKey });
}

export async function safetyCheck(req, res) {
  try {
    const { text, imageDataUrl, mode } = req.body || {};

    if (!text && !imageDataUrl) {
      return res.status(400).json({ reply: "נא לשלוח טקסט או תמונה לבדיקה." });
    }

    // אם אין תמונה – עדיין אפשר לענות כללי לפי הטקסט
    const userContent = [];

    if (text) {
      userContent.push({ type: "input_text", text });
    }

    if (imageDataUrl) {
      userContent.push({
        type: "input_image",
        image_url: imageDataUrl, // data:image/...;base64,...
        // detail: "low", // אופציונלי
      });
    }

    const selectedMode = mode || "social_upload";
    const systemPrompt = MODE_PROMPTS[selectedMode] || MODE_PROMPTS.social_upload;

    const openai = getOpenAIClient();
    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: [
        { role: "system", content: [{ type: "input_text", text: systemPrompt }] },
        { role: "user", content: userContent },
      ],
    });

    return res.json({ reply: response.output_text });
  } catch (err) {
    console.error("AI safetyCheck error:", err);
    return res.status(500).json({
      reply:
        err?.message ||
        "אופס, הייתה בעיה בשרת בזמן בדיקת התמונה. נסי שוב עוד רגע.",
    });
  }
}