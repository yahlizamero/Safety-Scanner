/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from 'react';
import { sendMessageToAI } from '../../services/chatService';
import "./ChatScreen.css";

// --- דמויות (Avatars) ---

// 👇 כאן שמנו את התמונה החדשה שביקשת
const BUNGI_AVATAR = "https://static.vecteezy.com/system/resources/previews/040/524/368/non_2x/cute-little-girl-in-flat-style-avatar-of-a-girl-on-a-white-background-portrait-vector.jpg";

// משתמש - דמות כללית (אפשר להחליף גם את זה אם תרצי)
const USER_AVATAR = "https://png.pngtree.com/png-clipart/20220110/original/pngtree-cute-little-girl-avatar-png-image_7068077.png";

function ChatScreen({ user }) {
  
  // הודעת פתיחה של בונגי
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      sender: 'system', 
      text: `היי ${user?.name || 'אורחת'}! 👋 \nנעים מאוד, אני בונגי (Bungi). \nאני כאן כדי לעזור לך לגלוש בטוח. שלחי לי תמונה או שאלה ונבדוק אותה יחד!`,
      avatar: BUNGI_AVATAR
    }
  ]);
  
  const [inputText, setInputText] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // גלילה אוטומטית
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

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

  const handleSend = async () => {
    if (!inputText.trim() && !selectedFile) return;

    // 1. יצירת הודעת משתמש
    const newMsg = {
      id: Date.now(),
      sender: 'user',
      text: inputText,
      image: previewUrl,
      avatar: USER_AVATAR
    };

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
      const aiResponse = await sendMessageToAI(textToSend, fileToSend);
      
      const systemMsg = {
        id: Date.now() + 1,
        sender: 'system',
        text: aiResponse,
        avatar: BUNGI_AVATAR
      };
      setMessages((prev) => [...prev, systemMsg]);

    } catch (error) {
      console.error(error);
      setMessages((prev) => [...prev, { 
          id: Date.now(), 
          sender: 'system', 
          text: "אופס, בונגי התעייפה לרגע... נסה שוב עוד מעט 😅", 
          avatar: BUNGI_AVATAR 
      }]);
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
      </header>

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
              {msg.image && <img src={msg.image} alt="uploaded" className="msg-image-preview" />}
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
                  <span>•</span><span>•</span><span>•</span>
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
            <button onClick={clearFile} className="close-preview">×</button>
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
            style={{display: 'none'}} 
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
          <button onClick={handleSend} disabled={isTyping || (!inputText && !selectedFile)} className="send-btn-cute">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"></path></svg>
          </button>
        </div>
      </footer>
    </div>
  );
}

export default ChatScreen;