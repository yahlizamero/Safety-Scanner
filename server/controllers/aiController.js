// server/controllers/aiController.js
import "dotenv/config";
import OpenAI from "openai";

function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "Missing OPENAI_API_KEY. Add it to server/.env (OPENAI_API_KEY=...) and restart."
    );
  }
  return new OpenAI({ apiKey });
}

const SYSTEM_PROMPT = `
אתה עוזר בטיחות דיגיטלית לנוער (13–17) בעברית. המשימה: להעריך האם תמונה/צילום מסך שמבקשים להעלות לרשת מכיל פרטים מזהים או רגישים, ולהמליץ מה לטשטש/לחתוך כדי לצמצם סיכון.

כללים:
- אל תזהה אנשים, אל תנחש שמות/מיקומים, ואל תציע דרכים לעקוף פרטיות.
- זהירות מיוחדת כשיש קטינים/ות: פנים, שם/לוגו של בית ספר/גן, תגי שם, מדים/סמלים, רמזי מיקום (שלטי רחוב, נקודות ציון), לוחיות רישוי, מסמכים/ברקודים/קודים.
- אם יש כיתוב/לוגו/שלט שמזהה מוסד או מיקום—המלץ לטשטש/לחתוך.
- אם יש פנים ברורות של קטינים—המלץ לטשטש פנים או לוודא אישור הורים לפני פרסום פומבי.
- אם אין פרטים מזהים משמעותיים, אמור זאת במפורש.

פורמט תשובה (חובה):
1) שורת פתיחה קצרה שמסכמת האם יש מה לטשטש.
2) "פרטים מזהים/רגישים בתמונה" + רשימה ממוספרת.
3) "מה לא בעייתי במיוחד" (אם רלוונטי).
4) "המלצה מעשית" – צעדים ספציפיים: טשטוש/חיתוך/הסתרה.
5) סיום קצר, בטון אמפתי ובטוח.
`.trim();

export async function safetyCheck(req, res) {
  try {
    const { text, imageDataUrl } = req.body || {};

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

    const openai = getOpenAIClient();
    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: [
        { role: "system", content: [{ type: "input_text", text: SYSTEM_PROMPT }] },
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