const express = require('express');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// In-memory storage (replace with database in production)
let sermons = [
  {
    id: 1,
    title: 'Church of Pentecost - Live Service',
    speaker: 'The Church of Pentecost',
    date: '2025-11-10',
    series: 'Sunday Worship',
    description: 'Join us for powerful worship, inspiring messages, and life-changing moments from The Church of Pentecost.',
    videoUrl: 'https://www.youtube.com/embed/e_bbZdZk7eM',
    thumbnail: 'Service Thumbnail 1',
    createdAt: '2025-11-10T12:30:00Z'
  },
  {
    id: 2,
    title: 'Church of Pentecost - Worship & Word',
    speaker: 'The Church of Pentecost',
    date: '2025-11-03',
    series: 'Sunday Service',
    description: 'Experience spirit-filled worship and powerful preaching from The Church of Pentecost.',
    videoUrl: 'https://www.youtube.com/embed/0hui8AP1_j4',
    thumbnail: 'Service Thumbnail 2',
    createdAt: '2025-11-03T12:30:00Z'
  },
  {
    id: 3,
    title: 'Church of Pentecost - Live Broadcast',
    speaker: 'The Church of Pentecost',
    date: '2025-10-27',
    series: 'Special Service',
    description: 'Join believers worldwide for this special service from The Church of Pentecost.',
    videoUrl: 'https://www.youtube.com/embed/wT60VvXIU44',
    thumbnail: 'Service Thumbnail 3',
    createdAt: '2025-10-27T12:30:00Z'
  },
  {
    id: 4,
    title: 'Church of Pentecost - Sunday Service',
    speaker: 'The Church of Pentecost',
    date: '2025-10-20',
    series: 'Sunday Worship',
    description: 'Powerful ministry and worship from The Church of Pentecost headquarters.',
    videoUrl: 'https://www.youtube.com/embed/gvcRQWNAsdc',
    thumbnail: 'Service Thumbnail 4',
    createdAt: '2025-10-20T12:30:00Z'
  }
];

let sermonIdCounter = 5;

// Get all sermons
router.get('/', (req, res) => {
  try {
    const sortedSermons = [...sermons].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
    res.json(sortedSermons);
  } catch (error) {
    console.error('Error fetching sermons:', error);
    res.status(500).json({ error: 'Failed to fetch sermons' });
  }
});

// Get single sermon
router.get('/:id', (req, res) => {
  try {
    const sermon = sermons.find(s => s.id === parseInt(req.params.id));
    
    if (!sermon) {
      return res.status(404).json({ error: 'Sermon not found' });
    }

    res.json(sermon);
  } catch (error) {
    console.error('Error fetching sermon:', error);
    res.status(500).json({ error: 'Failed to fetch sermon' });
  }
});

// Create sermon (admin only)
router.post('/', authMiddleware, (req, res) => {
  try {
    const { title, speaker, date, series, description, videoUrl, thumbnail } = req.body;

    if (!title || !speaker || !date) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newSermon = {
      id: sermonIdCounter++,
      title,
      speaker,
      date,
      series: series || '',
      description: description || '',
      videoUrl: videoUrl || '',
      thumbnail: thumbnail || '',
      createdAt: new Date().toISOString()
    };

    sermons.push(newSermon);
    res.status(201).json(newSermon);
  } catch (error) {
    console.error('Error creating sermon:', error);
    res.status(500).json({ error: 'Failed to create sermon' });
  }
});

// Update sermon (admin only)
router.put('/:id', authMiddleware, (req, res) => {
  try {
    const { id } = req.params;
    const index = sermons.findIndex(s => s.id === parseInt(id));

    if (index === -1) {
      return res.status(404).json({ error: 'Sermon not found' });
    }

    sermons[index] = {
      ...sermons[index],
      ...req.body,
      id: parseInt(id)
    };

    res.json(sermons[index]);
  } catch (error) {
    console.error('Error updating sermon:', error);
    res.status(500).json({ error: 'Failed to update sermon' });
  }
});

// Delete sermon (admin only)
router.delete('/:id', authMiddleware, (req, res) => {
  try {
    const { id } = req.params;
    const index = sermons.findIndex(s => s.id === parseInt(id));

    if (index === -1) {
      return res.status(404).json({ error: 'Sermon not found' });
    }

    sermons.splice(index, 1);
    res.json({ message: 'Sermon deleted' });
  } catch (error) {
    console.error('Error deleting sermon:', error);
    res.status(500).json({ error: 'Failed to delete sermon' });
  }
});

module.exports = router;

