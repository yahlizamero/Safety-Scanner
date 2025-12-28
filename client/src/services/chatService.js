import OpenAI from "openai";

// חיבור ל-OpenAI
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY, 
  dangerouslyAllowBrowser: true 
});

export const sendMessageToAI = async (text, file) => {
  // --- התיקון כאן: הוספנו את file להדפסה ---
  console.log("Sending to OpenAI -> Text:", text, "File:", file);

  try {
    const messages = [
      {
        role: "system",
        content: "אתה עוזר בטיחות חכם בשם SafetyScanner. התפקיד שלך הוא לעזור למשתמשים לזהות סכנות במוצרים. ענה תמיד בעברית, בצורה קצרה ומקצועית."
      },
      {
        role: "user",
        content: text
      }
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o", 
      messages: messages,
    });

    return completion.choices[0].message.content;

  } catch (error) {
    console.error("Error communicating with OpenAI:", error);
    return "אופס, נתקלתי בבעיה בחיבור לשרת ה-AI. אנא בדוק את החיבור לרשת או את המפתח (API Key).";
  }
};