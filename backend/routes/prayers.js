const express = require('express');
const authMiddleware = require('../middleware/auth');
const { sendPrayerRequestEmail, sendConfirmationEmail } = require('../utils/emailService');

const router = express.Router();

// In-memory storage (replace with database in production)
let prayerRequests = [];
let prayerIdCounter = 1;

// Submit prayer request
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message, isUrgent } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newPrayer = {
      id: prayerIdCounter++,
      name,
      email,
      phone: phone || null,
      subject: subject || 'Prayer Request',
      message,
      isUrgent: isUrgent || false,
      createdAt: new Date().toISOString()
    };

    prayerRequests.push(newPrayer);

    console.log('New prayer request received:', newPrayer);

    // Send email notification to church
    const emailResult = await sendPrayerRequestEmail(newPrayer);
    
    if (emailResult.success) {
      console.log('Prayer request email sent to church successfully');
      
      // Send confirmation email to the person who submitted
      await sendConfirmationEmail(email, name, 'prayer');
    } else {
      console.log('Email not sent:', emailResult.reason || emailResult.error);
    }

    res.status(201).json({ 
      message: 'Prayer request received. We will be praying for you!',
      id: newPrayer.id,
      emailSent: emailResult.success
    });
  } catch (error) {
    console.error('Prayer request error:', error);
    res.status(500).json({ error: 'Failed to submit prayer request' });
  }
});

// Get all prayer requests (admin only)
router.get('/', authMiddleware, (req, res) => {
  try {
    // Sort by most recent first
    const sortedPrayers = [...prayerRequests].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    
    res.json(sortedPrayers);
  } catch (error) {
    console.error('Error fetching prayer requests:', error);
    res.status(500).json({ error: 'Failed to fetch prayer requests' });
  }
});

// Delete prayer request (admin only)
router.delete('/:id', authMiddleware, (req, res) => {
  try {
    const { id } = req.params;
    const index = prayerRequests.findIndex(p => p.id === parseInt(id));

    if (index === -1) {
      return res.status(404).json({ error: 'Prayer request not found' });
    }

    prayerRequests.splice(index, 1);
    res.json({ message: 'Prayer request deleted' });
  } catch (error) {
    console.error('Error deleting prayer request:', error);
    res.status(500).json({ error: 'Failed to delete prayer request' });
  }
});

module.exports = router;

