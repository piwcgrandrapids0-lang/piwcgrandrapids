const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const authMiddleware = require('../middleware/auth');
const azureStorage = require('../utils/azureStorage');

const router = express.Router();

// Configure multer for memory storage (Azure upload)
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter
});

// Path to gallery data file
const galleryDataPath = path.join(__dirname, '../data/gallery.json');

// Helper function to read gallery data
const readGallery = () => {
  try {
    if (!fs.existsSync(galleryDataPath)) {
      // Initialize with placeholder images if file doesn't exist
      const initialData = {
        images: [
          {
            id: 1,
            title: 'Sunday Morning Worship Service',
            category: 'sunday-service',
            date: '2025-11-10',
            description: 'Our congregation gathered for a powerful Sunday morning worship service.',
            imageUrl: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=800&h=600&fit=crop&q=80',
            createdAt: '2025-11-10T12:30:00Z'
          }
        ],
        nextId: 2
      };
      fs.writeFileSync(galleryDataPath, JSON.stringify(initialData, null, 2));
      return initialData;
    }
    const data = fs.readFileSync(galleryDataPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading gallery:', error);
    return { images: [], nextId: 1 };
  }
};

// Helper function to write gallery data
const writeGallery = (data) => {
  try {
    fs.writeFileSync(galleryDataPath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing gallery:', error);
    return false;
  }
};

// GET all gallery images
router.get('/', (req, res) => {
  try {
    const galleryData = readGallery();
    // Sort by date (most recent first)
    const sortedImages = [...galleryData.images].sort((a, b) => 
      new Date(b.date) - new Date(a.date)
    );
    res.json(sortedImages);
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    res.status(500).json({ error: 'Failed to fetch gallery images' });
  }
});

// GET single image by ID
router.get('/:id', (req, res) => {
  try {
    const galleryData = readGallery();
    const image = galleryData.images.find(img => img.id === parseInt(req.params.id));
    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }
    res.json(image);
  } catch (error) {
    console.error('Error fetching image:', error);
    res.status(500).json({ error: 'Failed to fetch image' });
  }
});

// POST new image (admin only)
router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { title, category, date, description } = req.body;

    // Validation
    if (!title || !category || !date) {
      return res.status(400).json({ error: 'Title, category, and date are required' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Image file is required' });
    }

    const galleryData = readGallery();
    let imageUrl;

    // Try to upload to Azure if configured, otherwise use local storage
    if (azureStorage.isConfigured()) {
      try {
        const uploadResult = await azureStorage.uploadImage(
          req.file.buffer,
          req.file.originalname,
          req.file.mimetype,
          'gallery'
        );
        imageUrl = uploadResult.url;
        console.log('Image uploaded to Azure Blob Storage');
      } catch (azureError) {
        console.error('Azure upload failed, falling back to local storage:', azureError.message);
        // Fall back to local storage
        const uploadsDir = path.join(__dirname, '../uploads/gallery');
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const filename = 'gallery-' + uniqueSuffix + path.extname(req.file.originalname);
        const filePath = path.join(uploadsDir, filename);
        fs.writeFileSync(filePath, req.file.buffer);
        imageUrl = `/uploads/gallery/${filename}`;
      }
    } else {
      // Use local storage if Azure is not configured
      console.log('Azure Storage not configured, using local storage');
      const uploadsDir = path.join(__dirname, '../uploads/gallery');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const filename = 'gallery-' + uniqueSuffix + path.extname(req.file.originalname);
      const filePath = path.join(uploadsDir, filename);
      fs.writeFileSync(filePath, req.file.buffer);
      imageUrl = `/uploads/gallery/${filename}`;
    }

    const newImage = {
      id: galleryData.nextId,
      title,
      category,
      date,
      description: description || '',
      imageUrl: imageUrl,
      createdAt: new Date().toISOString()
    };

    galleryData.images.push(newImage);
    galleryData.nextId++;

    if (!writeGallery(galleryData)) {
      return res.status(500).json({ error: 'Failed to save image data' });
    }

    console.log('New gallery image added:', newImage.id);

    res.status(201).json({
      message: 'Image uploaded successfully',
      image: newImage
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// DELETE image (admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const imageId = parseInt(req.params.id);
    const galleryData = readGallery();
    const imageIndex = galleryData.images.findIndex(img => img.id === imageId);

    if (imageIndex === -1) {
      return res.status(404).json({ error: 'Image not found' });
    }

    const image = galleryData.images[imageIndex];

    // Delete file from Azure or local filesystem
    if (image.imageUrl) {
      if (image.imageUrl.includes('blob.core.windows.net')) {
        // Azure Blob Storage URL - extract blob name and delete
        try {
          const urlParts = new URL(image.imageUrl);
          const blobName = urlParts.pathname.split('/').slice(2).join('/'); // Remove container name
          if (azureStorage.isConfigured()) {
            await azureStorage.deleteImage(blobName);
            console.log('Deleted from Azure:', blobName);
          }
        } catch (azureError) {
          console.error('Error deleting from Azure:', azureError.message);
        }
      } else if (image.imageUrl.startsWith('/uploads/')) {
        // Local file - delete from filesystem
        const filePath = path.join(__dirname, '..', image.imageUrl);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log('Deleted local file:', filePath);
        }
      }
    }

    // Remove from array
    galleryData.images.splice(imageIndex, 1);

    if (!writeGallery(galleryData)) {
      return res.status(500).json({ error: 'Failed to update gallery data' });
    }

    console.log('Deleted gallery image:', imageId);

    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ error: 'Failed to delete image' });
  }
});

// GET images by category
router.get('/category/:category', (req, res) => {
  try {
    const { category } = req.params;
    const galleryData = readGallery();
    const filteredImages = galleryData.images
      .filter(img => img.category === category)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    res.json(filteredImages);
  } catch (error) {
    console.error('Error fetching images by category:', error);
    res.status(500).json({ error: 'Failed to fetch images' });
  }
});

module.exports = router;
