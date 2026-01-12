import axiosInstance from "./api";

// Convert a File (image) to a DataURL (base64) so we can send it to the server.
function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result); // "data:image/...;base64,..."
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export const sendMessageToAI = async (
  text,
  file,
  mode = "social_upload",
  followUp = false,
  history = []
) => {
  console.log("Sending to backend -> Mode:", mode, "Text:", text, "File:", file);

  try {
    let imageDataUrl = null;

    if (file) {
      const MAX_MB = 5;
      if (file.size > MAX_MB * 1024 * 1024) {
        return `התמונה גדולה מדי (מעל ${MAX_MB}MB). נסי להעלות תמונה קטנה יותר.`;
      }
      imageDataUrl = await fileToDataUrl(file);
    }

    const { data } = await axiosInstance.post("/ai/safety-check", {
      text,
      imageDataUrl,
      mode,
      followUp,
      history,
    });

    return data?.reply ?? "לא התקבלה תשובה מהשרת.";
  } catch (error) {
    console.error("Error calling /ai/safety-check:", error);
    const serverMsg = error?.response?.data?.reply;
    return (
      serverMsg ||
      "אופס, הייתה בעיה בשרת בזמן בדיקת התמונה. ודאי שה-Backend רץ ושה-API base URL נכון."
    );
  }
};
