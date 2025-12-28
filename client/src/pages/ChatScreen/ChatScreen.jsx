/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from 'react'; // מחקנו את React מכאן כי לא צריך אותו
import { sendMessageToAI } from '../../services/chatService'; 
import "./ChatScreen.css"; 

function ChatScreen({ user }) {
  
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      sender: 'system', 
      text: `היי ${user?.name || 'אורחת'}! ברוכה הבאה. כאן אפשר לשאול שאלות על בטיחות מוצרים או לדווח על בעיה.` 
    }
  ]);

  const [inputText, setInputText] = useState("");      
  const [selectedFile, setSelectedFile] = useState(null); 
  const [isTyping, setIsTyping] = useState(false);     

  const messagesEndRef = useRef(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);


  const handleSend = async () => {
    if (!inputText.trim() && !selectedFile) return;

    const newMsg = {
      id: Date.now(),
      sender: 'user',
      text: inputText,
      image: selectedFile ? URL.createObjectURL(selectedFile) : null
    };

    setMessages((prev) => [...prev, newMsg]); 
    setInputText("");       
    setSelectedFile(null);  
    setIsTyping(true);      

    try {
      const aiResponseText = await sendMessageToAI(newMsg.text, selectedFile);

      const systemMsg = {
        id: Date.now() + 1,
        sender: 'system',
        text: aiResponseText
      };
      setMessages((prev) => [...prev, systemMsg]);
      
    } catch (error) {
      console.error("Error:", error);
      alert("הייתה בעיה בשליחת ההודעה");
    } finally {
      setIsTyping(false); 
    }
  };

  return (
    <div className="chat-screen">
      <header className="chat-header">
        <h2>Safe Chat</h2>
      </header>

      <main className="chat-messages">
        {messages.map((msg) => (
          <div key={msg.id} style={{
            display: 'flex',
            justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
            marginBottom: '10px'
          }}>
            <div className={`message-bubble ${msg.sender}`} style={{
              background: msg.sender === 'user' ? '#eef2ff' : 'white',
              padding: '10px 15px',
              borderRadius: '15px',
              maxWidth: '70%',
              boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
              border: '1px solid #eee',
              textAlign: 'right',
              direction: 'rtl'
            }}>
              <strong>{msg.sender === 'system' ? 'SafetyBot' : (user?.name || 'אני')}: </strong>
              <div style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</div>
              
              {msg.image && (
                <img 
                  src={msg.image} 
                  alt="uploaded" 
                  style={{maxWidth: '100%', marginTop: '10px', borderRadius: '10px'}} 
                />
              )}
            </div>
          </div>
        ))}

        {isTyping && <div style={{color: '#888', fontStyle: 'italic', margin: '10px'}}>המערכת מקלידה...</div>}
        
        <div ref={messagesEndRef} />
      </main>

      <footer className="chat-input">
        <input 
          type="text" 
          placeholder="הקלד הודעה..." 
          value={inputText}
          onChange={(e) => setInputText(e.target.value)} 
          onKeyDown={(e) => e.key === 'Enter' && handleSend()} 
          disabled={isTyping}
        />

        <input 
          type="file" 
          accept="image/*" 
          onChange={(e) => setSelectedFile(e.target.files[0])} 
          disabled={isTyping}
        />

        <button onClick={handleSend} disabled={isTyping}>
          {isTyping ? '...' : 'Send'}
        </button>
      </footer>
    </div>
  );
}

export default ChatScreen;