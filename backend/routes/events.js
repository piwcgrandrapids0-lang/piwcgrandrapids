const express = require('express');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// In-memory storage (replace with database in production)
let events = [
  {
    id: 1,
    title: 'Sunday Worship Service',
    date: '2025-11-17',
    time: '12:30 PM',
    location: 'Main Sanctuary',
    category: 'Worship',
    description: 'Join us for Spirit-filled worship, powerful preaching, and fellowship.',
    recurring: true
  },
  {
    id: 2,
    title: 'Prayer Night',
    date: '2025-11-18',
    time: '7:00 PM',
    location: 'Online',
    category: 'Prayer',
    description: 'Intercession, worship, and seeking God\'s face together.'
  }
];

let eventIdCounter = 3;

// Get all events
router.get('/', (req, res) => {
  try {
    const sortedEvents = [...events].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
    res.json(sortedEvents);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// Get single event
router.get('/:id', (req, res) => {
  try {
    const event = events.find(e => e.id === parseInt(req.params.id));
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ error: 'Failed to fetch event' });
  }
});

// Create event (admin only)
router.post('/', authMiddleware, (req, res) => {
  try {
    const { title, date, time, location, category, description, recurring } = req.body;

    if (!title || !date || !time || !location) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newEvent = {
      id: eventIdCounter++,
      title,
      date,
      time,
      location,
      category: category || 'General',
      description: description || '',
      recurring: recurring || false
    };

    events.push(newEvent);
    res.status(201).json(newEvent);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Failed to create event' });
  }
});

// Update event (admin only)
router.put('/:id', authMiddleware, (req, res) => {
  try {
    const { id } = req.params;
    const index = events.findIndex(e => e.id === parseInt(id));

    if (index === -1) {
      return res.status(404).json({ error: 'Event not found' });
    }

    events[index] = {
      ...events[index],
      ...req.body,
      id: parseInt(id)
    };

    res.json(events[index]);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ error: 'Failed to update event' });
  }
});

// Delete event (admin only)
router.delete('/:id', authMiddleware, (req, res) => {
  try {
    const { id } = req.params;
    const index = events.findIndex(e => e.id === parseInt(id));

    if (index === -1) {
      return res.status(404).json({ error: 'Event not found' });
    }

    events.splice(index, 1);
    res.json({ message: 'Event deleted' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

module.exports = router;

