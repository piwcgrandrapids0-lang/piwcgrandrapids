const express = require('express');
const authMiddleware = require('../middleware/auth');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// File path for persistent storage
const sermonsDataPath = path.join(__dirname, '../data/sermons.json');

// Helper function to read sermons from file
const readSermons = () => {
  try {
    // Ensure data directory exists
    const dataDir = path.dirname(sermonsDataPath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // If file doesn't exist, create it with empty data
    if (!fs.existsSync(sermonsDataPath)) {
      const initialData = {
        sermons: [],
        nextId: 1
      };
      fs.writeFileSync(sermonsDataPath, JSON.stringify(initialData, null, 2));
      return initialData;
    }
    const data = fs.readFileSync(sermonsDataPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading sermons:', error);
    return { sermons: [], nextId: 1 };
  }
};

// Helper function to write sermons to file
const writeSermons = (data) => {
  try {
    fs.writeFileSync(sermonsDataPath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing sermons:', error);
    return false;
  }
};

// Get all sermons
router.get('/', (req, res) => {
  try {
    const sermonsData = readSermons();
    const sortedSermons = [...sermonsData.sermons].sort(
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
    const sermonsData = readSermons();
    const sermon = sermonsData.sermons.find(s => s.id === parseInt(req.params.id));
    
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

    const sermonsData = readSermons();

    const newSermon = {
      id: sermonsData.nextId++,
      title,
      speaker,
      date,
      series: series || '',
      description: description || '',
      videoUrl: videoUrl || '',
      thumbnail: thumbnail || '',
      createdAt: new Date().toISOString()
    };

    sermonsData.sermons.push(newSermon);
    writeSermons(sermonsData);
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
    const sermonsData = readSermons();
    const index = sermonsData.sermons.findIndex(s => s.id === parseInt(id));

    if (index === -1) {
      return res.status(404).json({ error: 'Sermon not found' });
    }

    sermonsData.sermons[index] = {
      ...sermonsData.sermons[index],
      ...req.body,
      id: parseInt(id)
    };

    writeSermons(sermonsData);
    res.json(sermonsData.sermons[index]);
  } catch (error) {
    console.error('Error updating sermon:', error);
    res.status(500).json({ error: 'Failed to update sermon' });
  }
});

// Delete sermon (admin only)
router.delete('/:id', authMiddleware, (req, res) => {
  try {
    const { id } = req.params;
    const sermonsData = readSermons();
    const index = sermonsData.sermons.findIndex(s => s.id === parseInt(id));

    if (index === -1) {
      return res.status(404).json({ error: 'Sermon not found' });
    }

    sermonsData.sermons.splice(index, 1);
    writeSermons(sermonsData);
    res.json({ message: 'Sermon deleted' });
  } catch (error) {
    console.error('Error deleting sermon:', error);
    res.status(500).json({ error: 'Failed to delete sermon' });
  }
});

module.exports = router;
