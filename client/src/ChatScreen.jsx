import React from "react";
import "./chatScreen.css";

function ChatScreen() {
  return (
    <div className="chat-screen">
      
      {/* כותרת */}
      <header className="chat-header">
        <h2>צ'אט בטיחותי</h2>
      </header>

      {/* אזור ההודעות */}
      <main className="chat-messages">
        <p><strong>מערכת:</strong> ברוכה הבאה לצ'אט! איך אפשר לעזור?</p>
        <p><strong>משתמשת:</strong> היי, אני רוצה לדווח על משהו.</p>
        {/* הודעות נוספות יתווספו כאן בהמשך */}
      </main>

      {/* אזור הקלט */}
      <footer className="chat-input">
        <input
          type="text"
          placeholder="כתבי הודעה כאן..."
        />

        <input
          type="file"
          accept="image/*"
        />

        <button>שלח</button>
      </footer>

    </div>
  );
}

export default ChatScreen;
