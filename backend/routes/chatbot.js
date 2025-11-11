const express = require('express');
const axios = require('axios');
const { searchKnowledge, getQuickActions } = require('../utils/chatbotKnowledge');
const { churchInfo } = require('../utils/churchInfo');
const { generateWelcomeMessage, answerWhatIf } = require('../utils/visitorHelper');

const router = express.Router();

// Enhanced function to get contextual response using knowledge base
const getContextualResponse = (message) => {
  const lowerMessage = message.toLowerCase();

  // Check for greetings
  if (lowerMessage.match(/^(hi|hello|hey|good morning|good afternoon|greetings)/)) {
    return `Hello! 👋 Welcome to PIWC Grand Rapids. How can I help you today?\n\nYou can ask me about:\n• Service times\n• Location & directions\n• Kids programs\n• What to expect as a visitor\n• Contact information\n\nWhat would you like to know?`;
  }

  // Check for "what if" scenarios
  if (lowerMessage.includes('what if')) {
    const scenario = answerWhatIf(lowerMessage);
    return `**${scenario.question}**\n\n${scenario.answer}`;
  }

  // Search knowledge base
  const knowledge = searchKnowledge(message);
  if (knowledge) {
    return knowledge.answer;
  }

  return null;
};

// Chatbot message endpoint
router.post('/message', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // First, try to match with our knowledge base
    const contextualResponse = getContextualResponse(message);
    
    if (contextualResponse) {
      return res.json({ reply: contextualResponse });
    }

    // If Gemini API key is available, use it for more complex queries
    if (process.env.GEMINI_API_KEY) {
      try {
        const geminiResponse = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
          {
            contents: [{
              parts: [{
                text: `You are a friendly, helpful assistant for PIWC Grand Rapids, The Church of Pentecost USA, Inc. (Detroit District).

**CHURCH INFORMATION:**
- Full Name: The Church of Pentecost USA, Inc. - PIWC Grand Rapids (Detroit District)
- Location: ${churchInfo.address.full}
- Sunday Service: ${churchInfo.services.sunday.time} (In-Person)
- Friday Prayer Meeting: ${churchInfo.services.friday.time} (Online)
- Pastor: ${churchInfo.leadership.pastor.name}
- Phone: ${churchInfo.contact.phone}
- Email: ${churchInfo.contact.email}
- Instagram: ${churchInfo.contact.instagram}
- Facebook: ${churchInfo.contact.facebook}

**ABOUT US:**
- Part of The Church of Pentecost (founded in Ghana, 1953)
- Over 4 million members in 100+ nations
- Pentecostal denomination emphasizing Holy Spirit, evangelism, holiness
- We have programs for kids, youth, men, women, worship, prayer, and outreach

**KEY POINTS:**
- Come as you are - dress casually or formally
- Free parking on-site
- PIWC Kids programs during Sunday service
- First-time visitors always welcome
- No pressure to give as a guest

User question: ${message}

Provide a warm, helpful response. Use emojis appropriately. If you don't have specific information, direct them to contact the church. Keep responses concise but friendly.`
              }]
            }]
          }
        );

        const reply = geminiResponse.data.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (reply) {
          return res.json({ reply });
        }
      } catch (geminiError) {
        console.error('Gemini API error:', geminiError);
        // Fall through to default response
      }
    }

    // Default response if no match found
    res.json({
      reply: `Thank you for your question! I'd love to help you find the answer. 😊\n\n**Quick Info:**\n📍 Location: ${churchInfo.address.full}\n⏰ Sunday Service: ${churchInfo.services.sunday.time}\n⏰ Friday Prayer: ${churchInfo.services.friday.time} (Online)\n\n**Contact Us:**\n📞 ${churchInfo.contact.phone}\n📧 ${churchInfo.contact.email}\n📱 Instagram: @piwc_grandrapids\n📘 Facebook: PIWC Grand Rapids\n\nFeel free to ask me anything about our services, location, programs, or visiting!`
    });

  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
});

module.exports = router;

