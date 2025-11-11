const express = require('express');
const authMiddleware = require('../middleware/auth');
const { sendContactFormEmail, sendConfirmationEmail } = require('../utils/emailService');

const router = express.Router();

// In-memory storage (replace with database in production)
let contactMessages = [];
let messageIdCounter = 1;

// Submit contact form
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newMessage = {
      id: messageIdCounter++,
      name,
      email,
      phone: phone || null,
      subject,
      message,
      createdAt: new Date().toISOString()
    };

    contactMessages.push(newMessage);

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
    // Sort by most recent first
    const sortedMessages = [...contactMessages].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    
    res.json(sortedMessages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

module.exports = router;

