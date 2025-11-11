import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './Chatbot.css';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: "Hello! Welcome to PIWC Grand Rapids. How can I help you today?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Function to format markdown text
  const formatMessage = (text) => {
    // Convert **bold** to <strong>
    let formatted = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    
    // Convert line breaks to <br />
    formatted = formatted.replace(/\n/g, '<br />');
    
    // Convert bullet points (• ) to proper list formatting
    formatted = formatted.replace(/^• (.+)$/gm, '<div style="margin-left: 1rem;">• $1</div>');
    
    return formatted;
  };

  const quickQuestions = [
    { id: 1, text: "When is your service?", icon: "🕐" },
    { id: 2, text: "Where are you located?", icon: "📍" },
    { id: 3, text: "Do you have a kids program?", icon: "👶" },
    { id: 4, text: "What should I wear?", icon: "👔" },
    { id: 5, text: "Can I watch online?", icon: "📺" },
    { id: 6, text: "Who is the pastor?", icon: "⛪" }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Reset messages when chat is closed
  useEffect(() => {
    if (!isOpen) {
      // Reset to initial welcome message when chat is closed
      setMessages([
        {
          type: 'bot',
          text: "Hello! Welcome to PIWC Grand Rapids. How can I help you today?",
          timestamp: new Date()
        }
      ]);
    }
  }, [isOpen]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleQuickQuestion = (question) => {
    handleSendMessage(question);
  };

  const handleSendMessage = async (messageText = inputValue) => {
    if (!messageText.trim()) return;

    const userMessage = {
      type: 'user',
      text: messageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await axios.post('/api/chatbot/message', {
        message: messageText,
        conversationHistory: messages.slice(-5) // Send last 5 messages for context
      });

      const botMessage = {
        type: 'bot',
        text: response.data.reply,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chatbot error:', error);
      const errorMessage = {
        type: 'bot',
        text: "I'm sorry, I'm having trouble responding right now. Please try again or contact us directly at piwcgrandrapids0@gmail.com or call (616) 123-4567.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Icon */}
      <button 
        className={`chatbot-icon ${isOpen ? 'active' : ''}`}
        onClick={toggleChat}
        aria-label="Open chat"
      >
        {isOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
          </svg>
        )}
      </button>

      {/* Chat Window */}
      <div className={`chatbot-window ${isOpen ? 'active' : ''}`}>
        <div className="chatbot-header">
          <div className="chatbot-header-content">
            <div className="chatbot-avatar">
              <span>⛪</span>
            </div>
            <div className="chatbot-header-text">
              <h4>PIWC Assistant</h4>
              <span className="chatbot-status">
                <span className="status-dot"></span>
                Online
              </span>
            </div>
          </div>
          <button className="chatbot-close" onClick={toggleChat} aria-label="Close chat">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="chatbot-messages">
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={`message ${message.type === 'user' ? 'message-user' : 'message-bot'}`}
            >
              {message.type === 'bot' && (
                <div className="message-avatar">⛪</div>
              )}
              <div className="message-content">
                <div 
                  className="message-bubble"
                  dangerouslySetInnerHTML={{ __html: formatMessage(message.text) }}
                />
                <span className="message-time">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="message message-bot">
              <div className="message-avatar">⛪</div>
              <div className="message-content">
                <div className="message-bubble typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Questions */}
        {messages.length <= 1 && (
          <div className="quick-questions">
            <p className="quick-questions-title">Quick Questions:</p>
            <div className="quick-questions-grid">
              {quickQuestions.map(q => (
                <button
                  key={q.id}
                  className="quick-question-btn"
                  onClick={() => handleQuickQuestion(q.text)}
                >
                  <span className="quick-question-icon">{q.icon}</span>
                  <span className="quick-question-text">{q.text}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="chatbot-input-container">
          <input
            type="text"
            className="chatbot-input"
            placeholder="Type your message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button 
            className="chatbot-send-btn"
            onClick={() => handleSendMessage()}
            disabled={!inputValue.trim()}
            aria-label="Send message"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
          </button>
        </div>
      </div>
    </>
  );
};

export default Chatbot;

