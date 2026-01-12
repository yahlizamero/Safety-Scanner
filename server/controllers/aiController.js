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
    const { text, imageDataUrl, mode, followUp, history } = req.body || {};

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
    let systemPrompt = MODE_PROMPTS[selectedMode] || MODE_PROMPTS.social_upload;

    if (followUp) {
      systemPrompt += `

הנחיית המשך שיחה:
- ענה בשפה של המשתמשת ושמור על טון חם, חברי וזורם.
- זו שאלה המשך, אז תענה בשיחה זורמת וטבעית, בלי מבנה ממוספר קשיח.
- עדיף 1–2 פסקאות קצרות; אם חייבים, לכל היותר 2 נקודות.
- בלי "מקורות מומלצים" אלא אם המשתמשת ביקשה.
- שמור על טון חברי ותומך.
      `.trim();
    }

    const openai = getOpenAIClient();
    const input = [
      { role: "system", content: [{ type: "input_text", text: systemPrompt }] },
    ];

    const languageHint = (() => {
      if (!text) return "";
      // Simple heuristic: presence of Hebrew characters.
      return /[\u0590-\u05FF]/.test(text)
        ? "ענה בעברית."
        : "Answer in English.";
    })();

    if (Array.isArray(history)) {
      history.forEach((msg) => {
        if (!msg || (msg.role !== "user" && msg.role !== "assistant")) return;

        const content = [];
        if (msg.text) {
          content.push({
            type: msg.role === "assistant" ? "output_text" : "input_text",
            text: msg.text,
          });
        }
        if (msg.role === "user" && msg.imageDataUrl) {
          content.push({ type: "input_image", image_url: msg.imageDataUrl });
        }
        if (content.length > 0) {
          input.push({ role: msg.role, content });
        }
      });
    }

    if (languageHint) {
      input.push({
        role: "system",
        content: [{ type: "input_text", text: languageHint }],
      });
    }

    input.push({ role: "user", content: userContent });

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input,
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
