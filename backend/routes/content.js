const express = require('express');
const fs = require('fs');
const path = require('path');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

const contentFilePath = path.join(__dirname, '../data/content.json');

// Helper function to read content
const readContent = () => {
  try {
    const data = fs.readFileSync(contentFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading content:', error);
    return null;
  }
};

// Helper function to write content
const writeContent = (content) => {
  try {
    fs.writeFileSync(contentFilePath, JSON.stringify(content, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing content:', error);
    return false;
  }
};

// GET all content (public)
router.get('/', (req, res) => {
  const content = readContent();
  if (!content) {
    return res.status(500).json({ error: 'Failed to read content' });
  }
  res.json(content);
});

// GET specific section (public)
router.get('/:section', (req, res) => {
  const content = readContent();
  if (!content) {
    return res.status(500).json({ error: 'Failed to read content' });
  }
  
  const section = content[req.params.section];
  if (!section) {
    return res.status(404).json({ error: 'Section not found' });
  }
  
  res.json(section);
});

// UPDATE content section (admin only)
router.put('/:section', authMiddleware, (req, res) => {
  const content = readContent();
  if (!content) {
    return res.status(500).json({ error: 'Failed to read content' });
  }
  
  const sectionName = req.params.section;
  const updatedData = req.body;
  
  // Update the section
  content[sectionName] = updatedData;
  
  // Write back to file
  if (!writeContent(content)) {
    return res.status(500).json({ error: 'Failed to save content' });
  }
  
  console.log(`Content updated: ${sectionName}`);
  res.json({ 
    message: 'Content updated successfully',
    section: sectionName,
    data: updatedData
  });
});

// UPDATE entire content (admin only)
router.put('/', authMiddleware, (req, res) => {
  const updatedContent = req.body;
  
  if (!writeContent(updatedContent)) {
    return res.status(500).json({ error: 'Failed to save content' });
  }
  
  console.log('All content updated');
  res.json({ 
    message: 'All content updated successfully',
    data: updatedContent
  });
});

module.exports = router;

