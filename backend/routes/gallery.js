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
    const galleryData = JSON.parse(data);
    
    // Clean up images with local URLs (they're lost after deployment)
    // Keep only images with Azure URLs or external URLs
    const validImages = galleryData.images.filter(img => {
      if (!img.imageUrl) return false;
      // Keep Azure Blob Storage URLs
      if (img.imageUrl.includes('blob.core.windows.net')) return true;
      // Keep external URLs (http/https)
      if (img.imageUrl.startsWith('http://') || img.imageUrl.startsWith('https://')) return true;
      // Remove local URLs (they're lost after deployment)
      if (img.imageUrl.startsWith('/uploads/')) {
        console.log(`Removing image with local URL (lost after deployment): ${img.title} - ${img.imageUrl}`);
        return false;
      }
      return true;
    });
    
    // Only update if we removed some images
    if (validImages.length !== galleryData.images.length) {
      galleryData.images = validImages;
      writeGallery(galleryData);
      console.log(`Cleaned up ${galleryData.images.length - validImages.length} images with local URLs`);
    }
    
    return galleryData;
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

    // In production, always use Azure Blob Storage
    const isProduction = process.env.NODE_ENV === 'production';
    
    if (azureStorage.isConfigured()) {
      try {
        const uploadResult = await azureStorage.uploadImage(
          req.file.buffer,
          req.file.originalname,
          req.file.mimetype,
          'gallery'
        );
        imageUrl = uploadResult.url;
        console.log('Image uploaded to Azure Blob Storage:', uploadResult.url);
      } catch (azureError) {
        console.error('Azure upload failed:', azureError.message);
        console.error('Error details:', azureError);
        
        // In production, fail hard - don't use local storage
        if (isProduction) {
          return res.status(500).json({ 
            error: 'Failed to upload image to Azure Blob Storage. Please check Azure Storage configuration.',
            details: azureError.message
          });
        }
        
        // In development, allow fallback to local storage
        console.warn(' Falling back to local storage (development mode only)');
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
      // Azure not configured
      if (isProduction) {
        return res.status(500).json({ 
          error: 'Azure Blob Storage is not configured. Please set AZURE_STORAGE_CONNECTION_STRING environment variable.'
        });
      }
      
      // In development, allow local storage
      console.warn(' Azure Storage not configured, using local storage (development mode only)');
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
          // Extract blob name: pathname is like /church-images/gallery/filename.png
          // We need just gallery/filename.png
          const pathParts = urlParts.pathname.split('/').filter(p => p);
          const containerIndex = pathParts.findIndex(p => p === 'church-images');
          if (containerIndex >= 0 && containerIndex < pathParts.length - 1) {
            const blobName = pathParts.slice(containerIndex + 1).join('/');
            if (azureStorage.isConfigured()) {
              await azureStorage.deleteImage(blobName);
              console.log('Deleted from Azure:', blobName);
            }
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

    // Save changes to file
    if (!writeGallery(galleryData)) {
      return res.status(500).json({ error: 'Failed to update gallery data' });
    }

    console.log('Deleted gallery image:', imageId, '- Removed from gallery.json and storage');

    res.json({ 
      message: 'Image deleted successfully',
      deleted: true,
      imageId: imageId
    });
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

// SYNC: Recover images from Azure Blob Storage (admin only)
router.post('/sync-from-azure', authMiddleware, async (req, res) => {
  try {
    if (!azureStorage.isConfigured()) {
      return res.status(500).json({ error: 'Azure Storage is not configured' });
    }

    const galleryData = readGallery();
    const existingUrls = new Set(galleryData.images.map(img => img.imageUrl));

    // List all images in Azure Blob Storage
    const azureImages = await azureStorage.listImages('gallery/');
    
    let addedCount = 0;
    for (const azureImage of azureImages) {
      // Skip if already in gallery
      if (existingUrls.has(azureImage.url)) {
        continue;
      }

      // Extract date from filename (format: gallery/TIMESTAMP-ID.ext)
      const filename = azureImage.name.split('/').pop();
      const timestampMatch = filename.match(/^(\d+)-/);
      const date = timestampMatch ? new Date(parseInt(timestampMatch[1])).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];

      // Add to gallery
      const newImage = {
        id: galleryData.nextId++,
        title: `Recovered Image ${galleryData.nextId - 1}`,
        category: 'general',
        date: date,
        description: 'Recovered from Azure Blob Storage',
        imageUrl: azureImage.url,
        createdAt: new Date(azureImage.lastModified).toISOString()
      };

      galleryData.images.push(newImage);
      existingUrls.add(azureImage.url);
      addedCount++;
    }

    if (addedCount > 0) {
      if (!writeGallery(galleryData)) {
        return res.status(500).json({ error: 'Failed to save gallery data' });
      }
    }

    res.json({
      message: `Synced ${addedCount} images from Azure Blob Storage`,
      added: addedCount,
      total: galleryData.images.length
    });
  } catch (error) {
    console.error('Error syncing from Azure:', error);
    res.status(500).json({ error: 'Failed to sync images from Azure' });
  }
});

module.exports = router;
