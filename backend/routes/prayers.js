const express = require('express');
const authMiddleware = require('../middleware/auth');
const { sendPrayerRequestEmail, sendConfirmationEmail } = require('../utils/emailService');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// File path for persistent storage
const prayersDataPath = path.join(__dirname, '../data/prayers.json');

// Helper function to read prayers from file
const readPrayers = () => {
  try {
    // Ensure data directory exists
    const dataDir = path.dirname(prayersDataPath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // If file doesn't exist, create it with empty data
    if (!fs.existsSync(prayersDataPath)) {
      const initialData = {
        prayers: [],
        nextId: 1
      };
      fs.writeFileSync(prayersDataPath, JSON.stringify(initialData, null, 2));
      return initialData;
    }
    const data = fs.readFileSync(prayersDataPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading prayers:', error);
    return { prayers: [], nextId: 1 };
  }
};

// Helper function to write prayers to file
const writePrayers = (data) => {
  try {
    fs.writeFileSync(prayersDataPath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing prayers:', error);
    return false;
  }
};

// Submit prayer request
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message, isUrgent } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const prayersData = readPrayers();

    const newPrayer = {
      id: prayersData.nextId++,
      name,
      email,
      phone: phone || null,
      subject: subject || 'Prayer Request',
      message,
      isUrgent: isUrgent || false,
      createdAt: new Date().toISOString(),
      read: false,
      readAt: null
    };

    prayersData.prayers.push(newPrayer);
    writePrayers(prayersData);

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
    const prayersData = readPrayers();
    // Sort by urgent first, then unread, then by date (most recent first)
    const sortedPrayers = [...prayersData.prayers].sort((a, b) => {
      // Urgent first
      if (a.isUrgent !== b.isUrgent) {
        return a.isUrgent ? -1 : 1;
      }
      // Unread messages first
      if (a.read !== b.read) {
        return a.read ? 1 : -1;
      }
      // Then by date (most recent first)
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    
    res.json(sortedPrayers);
  } catch (error) {
    console.error('Error fetching prayer requests:', error);
    res.status(500).json({ error: 'Failed to fetch prayer requests' });
  }
});

// Mark prayer request as read/unread (admin only)
router.patch('/:id/read', authMiddleware, (req, res) => {
  try {
    const { id } = req.params;
    const { read } = req.body;
    
    const prayersData = readPrayers();
    const prayer = prayersData.prayers.find(p => p.id === parseInt(id));
    
    if (!prayer) {
      return res.status(404).json({ error: 'Prayer request not found' });
    }
    
    prayer.read = read === true || read === 'true';
    prayer.readAt = prayer.read ? new Date().toISOString() : null;
    
    writePrayers(prayersData);
    
    res.json({ 
      message: prayer.read ? 'Prayer request marked as read' : 'Prayer request marked as unread', 
      data: prayer 
    });
  } catch (error) {
    console.error('Error updating prayer request read status:', error);
    res.status(500).json({ error: 'Failed to update prayer request status' });
  }
});

// Delete prayer request (admin only)
router.delete('/:id', authMiddleware, (req, res) => {
  try {
    const { id } = req.params;
    const prayersData = readPrayers();
    const index = prayersData.prayers.findIndex(p => p.id === parseInt(id));

    if (index === -1) {
      return res.status(404).json({ error: 'Prayer request not found' });
    }

    prayersData.prayers.splice(index, 1);
    writePrayers(prayersData);
    
    res.json({ message: 'Prayer request deleted' });
  } catch (error) {
    console.error('Error deleting prayer request:', error);
    res.status(500).json({ error: 'Failed to delete prayer request' });
  }
});

module.exports = router;
