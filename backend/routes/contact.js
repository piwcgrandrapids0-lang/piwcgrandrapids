const express = require('express');
const authMiddleware = require('../middleware/auth');
const { sendContactFormEmail, sendConfirmationEmail } = require('../utils/emailService');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// File path for persistent storage
const messagesDataPath = path.join(__dirname, '../data/messages.json');

// Helper function to read messages from file
const readMessages = () => {
  try {
    // Ensure data directory exists
    const dataDir = path.dirname(messagesDataPath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // If file doesn't exist, create it with empty data
    if (!fs.existsSync(messagesDataPath)) {
      const initialData = {
        messages: [],
        nextId: 1
      };
      fs.writeFileSync(messagesDataPath, JSON.stringify(initialData, null, 2));
      return initialData;
    }
    const data = fs.readFileSync(messagesDataPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading messages:', error);
    return { messages: [], nextId: 1 };
  }
};

// Helper function to write messages to file
const writeMessages = (data) => {
  try {
    fs.writeFileSync(messagesDataPath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing messages:', error);
    return false;
  }
};

// Submit contact form
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const messagesData = readMessages();

    const newMessage = {
      id: messagesData.nextId++,
      name,
      email,
      phone: phone || null,
      subject,
      message,
      createdAt: new Date().toISOString(),
      read: false,
      readAt: null
    };

    messagesData.messages.push(newMessage);
    writeMessages(messagesData);

    console.log('New contact message received:', newMessage);

    // Send email notification to church
    const emailResult = await sendContactFormEmail(newMessage);
    
    if (emailResult.success) {
      console.log('Email sent to church successfully');
      
      // Send confirmation email to the person who submitted
      await sendConfirmationEmail(email, name, 'contact');
    } else {
      console.log('Email not sent:', emailResult.reason || emailResult.error);
    }

    res.status(201).json({ 
      message: 'Message received successfully. We will get back to you soon!',
      id: newMessage.id,
      emailSent: emailResult.success
    });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ error: 'Failed to submit message' });
  }
});

// Get all contact messages (admin only)
router.get('/messages', authMiddleware, (req, res) => {
  try {
    const messagesData = readMessages();
    // Sort by most recent first, unread first
    const sortedMessages = [...messagesData.messages].sort((a, b) => {
      // Unread messages first
      if (a.read !== b.read) {
        return a.read ? 1 : -1;
      }
      // Then by date (most recent first)
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    
    res.json(sortedMessages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Mark message as read/unread (admin only)
router.patch('/messages/:id/read', authMiddleware, (req, res) => {
  try {
    const { id } = req.params;
    const { read } = req.body;
    
    const messagesData = readMessages();
    const message = messagesData.messages.find(m => m.id === parseInt(id));
    
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }
    
    message.read = read === true || read === 'true';
    message.readAt = message.read ? new Date().toISOString() : null;
    
    writeMessages(messagesData);
    
    res.json({ 
      message: message.read ? 'Message marked as read' : 'Message marked as unread', 
      data: message 
    });
  } catch (error) {
    console.error('Error updating message read status:', error);
    res.status(500).json({ error: 'Failed to update message status' });
  }
});

module.exports = router;
