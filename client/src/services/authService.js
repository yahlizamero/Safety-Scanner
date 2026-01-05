
const API_URL = import.meta.env.VITE_API_BASE_URL; 

export const login = async (userData) => {
  const response = await fetch(`${API_URL}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Login failed');
  return data;
};

export const signUp = async (userData) => {
  // שורת בדיקה - תסתכלי מה היא מדפיסה בדפדפן
  console.log("Attempting to connect to:", API_URL);

  if (!API_URL) {
    throw new Error("API URL is undefined. Check your .env file naming!");
  }

  const response = await fetch(`${API_URL}/api/users/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });

  const text = await response.text();
  
  try {
    return JSON.parse(text);
  } catch (err) {
  console.error("Full error details:", err); // הוספת המשתנה כאן תפתור את השגיאה בטרמינל
  throw new Error("Server communication error");
}
};