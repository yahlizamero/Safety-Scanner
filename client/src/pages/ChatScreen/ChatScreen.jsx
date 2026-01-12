/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { sendMessageToAI } from '../../services/chatService';
import logo from '../../assets/project-logo.png';
import "./ChatScreen.css";

// --- דמויות (Avatars) ---
const BUNGI_AVATAR =
  "https://static.vecteezy.com/system/resources/previews/040/524/368/non_2x/cute-little-girl-in-flat-style-avatar-of-a-girl-on-a-white-background-portrait-vector.jpg";

const USER_AVATAR =
  "https://png.pngtree.com/png-clipart/20220110/original/pngtree-cute-little-girl-avatar-png-image_7068077.png";

// --- Modes ---
const MODES = [
  { id: "social_upload", label: "העלאה לרשת" },
  { id: "general_safety", label: "בטיחות כללית" },
  { id: "help", label: "עזרה עכשיו" },
];

const MODE_DESC = {
  social_upload: "אני אבדוק פרטים מזהים/מיקום/בית ספר לפני פרסום 🕵️‍♀️",
  general_safety: "טיפים חכמים להתנהלות בטוחה ברשת + מקורות ללמוד מהם 📚",
  help: "אם משהו מטריד קורה עכשיו — אני איתך, צעד־צעד 💛",
};

function ChatScreen({ user }) {
  const [mode, setMode] = useState("social_upload");
  const didMountRef = useRef(false);

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'system',
      text: `היי ${user?.name || 'אורחת'}! 👋 \nנעים מאוד, אני בונגי (Bungi). \nאני כאן כדי לעזור לך לגלוש בטוח. שלחי לי תמונה או שאלה ונבדוק אותה יחד!`,
      avatar: BUNGI_AVATAR,
    },
  ]);

  const [inputText, setInputText] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
    };
  }, []);

  // גלילה אוטומטית
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // הודעת מערכת כשמחליפים מצב
  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }

    const label = MODES.find((m) => m.id === mode)?.label || mode;
    const modeMsg = {
      id: Date.now(),
      sender: "system",
      text: `מעולה 😊 עברנו למצב: ${label}. איך תרצי להמשיך?`,
      avatar: BUNGI_AVATAR,
    };

    setMessages((prev) => [...prev, modeMsg]);
  }, [mode]);

  // בחירת תמונה
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // ביטול בחירת תמונה
  const clearFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const fileToDataUrl = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleSend = async () => {
    if (!inputText.trim() && !selectedFile) return;

    // 1. יצירת הודעת משתמש
    const imageDataUrl = selectedFile ? await fileToDataUrl(selectedFile) : null;
    const newMsg = {
      id: Date.now(),
      sender: 'user',
      text: inputText,
      image: previewUrl,
      imageDataUrl,
      avatar: USER_AVATAR,
    };

    const isFollowUp = messages.some((msg) => msg.sender === 'user');
    const history = messages
      .filter((msg) => msg.sender === 'user' || msg.sender === 'system')
      .map((msg) => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        text: msg.text || '',
        imageDataUrl: msg.imageDataUrl || null,
      }));

    setMessages((prev) => [...prev, newMsg]);

    // שמירת נתונים לשליחה
    const textToSend = inputText;
    const fileToSend = selectedFile;

    // ניקוי שדות
    setInputText("");
    setSelectedFile(null);
    setPreviewUrl(null);
    setIsTyping(true);

    // 2. שליחה ל-AI
    try {
      const aiResponse = await sendMessageToAI(
        textToSend,
        fileToSend,
        mode,
        isFollowUp,
        history
      );

      const systemMsg = {
        id: Date.now() + 1,
        sender: 'system',
        text: aiResponse,
        avatar: BUNGI_AVATAR,
      };
      setMessages((prev) => [...prev, systemMsg]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          sender: 'system',
          text: "אופס, בונגי התעייפה לרגע... נסה שוב עוד מעט 😅",
          avatar: BUNGI_AVATAR,
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="chat-screen">
      {/* --- כותרת בונגי --- */}
      <header className="chat-header-cute">
        <img src={BUNGI_AVATAR} alt="Bungi" className="header-avatar" />
        <div>
          <h2>בונגי - סורק בטיחות</h2>
          <span className="online-status">● זמינה בשבילך</span>
        </div>
        <Link to="/" className="home-logo-link" aria-label="Back to home">
          <img src={logo} alt="SafetyScanner home" className="home-logo" />
        </Link>
      </header>

      <div className="chat-layout">
        {/* --- אזור הצ'אט (שיחה) --- */}
        <section className="chat-main">
          {/* --- אזור ההודעות --- */}
          <main className="chat-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`message-row-container ${msg.sender}`}>
                {/* אווטאר */}
                <img
                  src={msg.avatar || (msg.sender === 'system' ? BUNGI_AVATAR : USER_AVATAR)}
                  alt="avatar"
                  className="chat-avatar"
                />

                <div className={`message-bubble cute-bubble ${msg.sender}`}>
                  {msg.image && (
                    <img src={msg.image} alt="uploaded" className="msg-image-preview" />
                  )}
                  {msg.text && <p>{msg.text}</p>}
                </div>
              </div>
            ))}

            {/* אינדיקטור הקלדה */}
            {isTyping && (
              <div className="message-row-container system">
                <img src={BUNGI_AVATAR} alt="Bungi" className="chat-avatar" />
                <div className="message-bubble cute-bubble system typing-bubble">
                  <div className="typing-indicator">
                    <span>•</span>
                    <span>•</span>
                    <span>•</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </main>

          {/* --- אזור הקלט החדש --- */}
          <footer className="chat-input-area cute-input-area">
            {/* תצוגה מקדימה לתמונה */}
            {previewUrl && (
              <div className="image-preview-container">
                <img src={previewUrl} alt="preview" />
                <button onClick={clearFile} className="close-preview">
                  ×
                </button>
              </div>
            )}

            <div className="input-bar-cute">
              {/* כפתור העלאת תמונה (אייקון מצלמה) */}
              <label htmlFor="file-upload" className="icon-btn">
                📷
              </label>
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />

              {/* שדה טקסט */}
              <input
                type="text"
                placeholder="כתבי משהו לבונגי..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                disabled={isTyping}
                className="cute-text-input"
              />

              {/* כפתור שליחה */}
              <button
                onClick={handleSend}
                disabled={isTyping || (!inputText && !selectedFile)}
                className="send-btn-cute"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                >
                  <path d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"></path>
                </svg>
              </button>
            </div>
          </footer>
        </section>

        {/* --- Side Panel: מצבי שיחה --- */}
        <aside className="chat-aside">
          <div className="aside-card">
            <h3 className="aside-title">מצב שיחה</h3>
            <p className="aside-subtitle">{MODE_DESC[mode]}</p>

            <div className="mode-bar vertical">
              {MODES.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  className={`mode-btn ${mode === m.id ? "active" : ""}`}
                  onClick={() => setMode(m.id)}
                  disabled={isTyping}
                >
                  {m.label}
                </button>
              ))}
            </div>

            <div className="aside-divider" />
          </div>
        </aside>
      </div>
    </div>
  );
}

export default ChatScreen;
