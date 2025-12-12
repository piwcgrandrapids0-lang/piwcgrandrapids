const express = require('express');
const fs = require('fs');
const path = require('path');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Path to events data file
const eventsDataPath = path.join(__dirname, '../data/events.json');

// Helper function to read events data
const readEvents = () => {
  try {
    if (!fs.existsSync(eventsDataPath)) {
      // Initialize with default events if file doesn't exist
      const initialData = {
        events: [
          {
            id: 1,
            title: 'Sunday Worship Service',
            date: '2025-11-17',
            time: '12:30 PM',
            location: 'Main Sanctuary',
            category: 'Worship',
            description: 'Join us for Spirit-filled worship, powerful preaching, and fellowship.',
            recurrenceType: 'recurring'
          },
          {
            id: 2,
            title: 'Prayer Night',
            date: '2025-11-18',
            time: '7:00 PM',
            location: 'Online',
            category: 'Prayer',
            description: 'Intercession, worship, and seeking God\'s face together.',
            recurrenceType: 'one-time'
          }
        ],
        nextId: 3
      };
      fs.writeFileSync(eventsDataPath, JSON.stringify(initialData, null, 2));
      return initialData;
    }
    const data = fs.readFileSync(eventsDataPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading events:', error);
    return { events: [], nextId: 1 };
  }
};

// Helper function to write events data
const writeEvents = (data) => {
  try {
    fs.writeFileSync(eventsDataPath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing events:', error);
    return false;
  }
};

// Get all events
router.get('/', (req, res) => {
  try {
    const eventsData = readEvents();
    const sortedEvents = [...eventsData.events].sort(
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
    const eventsData = readEvents();
    const event = eventsData.events.find(e => e.id === parseInt(req.params.id));
    
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
    const { title, date, time, location, category, description, recurrenceType, flyerUrl } = req.body;

    if (!title || !date || !time || !location) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const eventsData = readEvents();

    const newEvent = {
      id: eventsData.nextId++,
      title,
      date,
      time,
      location,
      category: category || 'General',
      description: description || '',
      recurrenceType: recurrenceType || 'one-time', // 'recurring', 'one-time', 'occasional'
      flyerUrl: flyerUrl || null
    };

    eventsData.events.push(newEvent);

    if (!writeEvents(eventsData)) {
      return res.status(500).json({ error: 'Failed to save event' });
    }

    console.log('New event added:', newEvent.id);
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
    const eventsData = readEvents();
    const index = eventsData.events.findIndex(e => e.id === parseInt(id));

    if (index === -1) {
      return res.status(404).json({ error: 'Event not found' });
    }

    eventsData.events[index] = {
      ...eventsData.events[index],
      ...req.body,
      id: parseInt(id)
    };

    if (!writeEvents(eventsData)) {
      return res.status(500).json({ error: 'Failed to save event' });
    }

    console.log('Event updated:', id);
    res.json(eventsData.events[index]);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ error: 'Failed to update event' });
  }
});

// Delete event (admin only)
router.delete('/:id', authMiddleware, (req, res) => {
  try {
    const { id } = req.params;
    const eventsData = readEvents();
    const index = eventsData.events.findIndex(e => e.id === parseInt(id));

    if (index === -1) {
      return res.status(404).json({ error: 'Event not found' });
    }

    eventsData.events.splice(index, 1);

    if (!writeEvents(eventsData)) {
      return res.status(500).json({ error: 'Failed to save changes' });
    }

    console.log('Event deleted:', id);
    res.json({ message: 'Event deleted' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

module.exports = router;

