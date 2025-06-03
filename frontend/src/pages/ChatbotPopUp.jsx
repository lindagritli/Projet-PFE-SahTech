import React, { useState } from 'react';
import './ChatbotPopup.css';

function ChatbotPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessages = [...messages, { sender: '🤔 Moi', text: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/medical-chat/", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });

      const data = await res.json();
      setMessages([
        ...newMessages,
        { sender: '🤖', text: data.reply || 'Réponse non disponible.' }
      ]);
    } catch (err) {
      setMessages([
        ...newMessages,
        { sender: '🤖', text: '⚠️ Erreur de connexion.' }
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="chatbot-popup">
      {!isOpen && (
        <div className="chatbot-launcher" onClick={toggleChat}>
          <div className="modelViewPort">
            <div className="eva">
              <div className="head">
                <div className="eyeChamber">
                  <div className="eye"></div>
                  <div className="eye"></div>
                </div>
              </div>
              <div className="body"></div>
              <div className="hand"></div>
              <div className="hand"></div>
              <div className="scannerThing"></div>
              <div className="scannerOrigin"></div>
            </div>
          </div>
        </div>
      )}

      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            🤖 AI Assistant Médical
            <button onClick={toggleChat} className="close-btn">×</button>
          </div>
          <div className="chat-body">
            {messages.map((msg, idx) => (
              <div key={idx} className="chat-message">
                <strong>{msg.sender}</strong>: {msg.text}
              </div>
            ))}
            {loading && <div className="chat-message">⏳ Réponse en cours...</div>}
          </div>
          <form onSubmit={handleSubmit} className="chat-input">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Posez vos questions à l'assistant AI médical"
              required
            />
            <button type="submit">Envoyer</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default ChatbotPopup;
