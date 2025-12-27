import "./chatScreen.css";

function ChatScreen() {
  return (
    <div className="chat-screen">
      {/* כותרת */}
      <header className="chat-header">
        <h2>Safe Chat</h2>
      </header>

      {/* אזור ההודעות */}
      <main className="chat-messages">
        <p>
          <strong>System:</strong> Welcome to the chat! How can I help?
        </p>
        <p>
          <strong>User:</strong> Hi, I want to report something.
        </p>
        {/* הודעות נוספות יתווספו כאן בהמשך */}
      </main>

      {/* אזור הקלט */}
      <footer className="chat-input">
        <input type="text" placeholder="Type a message..." />

        <input type="file" accept="image/*" />

        <button>Send</button>
      </footer>
    </div>
  );
}

export default ChatScreen;