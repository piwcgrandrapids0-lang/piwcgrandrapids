const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const azureStorage = require('./utils/azureStorage');
const authRoutes = require('./routes/auth');
const chatbotRoutes = require('./routes/chatbot');
const contactRoutes = require('./routes/contact');
const prayerRoutes = require('./routes/prayers');
const sermonRoutes = require('./routes/sermons');
const eventRoutes = require('./routes/events');
const galleryRoutes = require('./routes/gallery');
const contentRoutes = require('./routes/content');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
// CORS configuration - allow frontend origin
app.use(cors({
  origin: [
    'https://www.piwcgrandrapids.com',
    'https://icy-beach-06a0b2a0f.3.azurestaticapps.net',
    'http://localhost:3000',
    'http://localhost:5001'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadType = req.body.uploadType || 'images';
    const uploadPath = path.join(__dirname, 'uploads', uploadType);
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const imageUpload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
    }
  }
});

const videoUpload = multer({ 
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit for videos
  fileFilter: (req, file, cb) => {
    const allowedTypes = /mp4|mov|avi|wmv|flv|mkv|webm/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = file.mimetype.startsWith('video/');
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only video files are allowed (mp4, mov, avi, wmv, flv, mkv, webm)'));
    }
  }
});

const documentUpload = multer({ 
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit for documents
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|ppt|pptx|jpg|jpeg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = file.mimetype === 'application/pdf' || 
                     file.mimetype.startsWith('application/vnd.ms-powerpoint') ||
                     file.mimetype.startsWith('application/vnd.openxmlformats-officedocument.presentationml') ||
                     file.mimetype.startsWith('image/');
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only PDF, PowerPoint, or image files are allowed'));
    }
  }
});

// Image upload endpoint
app.post('/api/upload', imageUpload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const uploadType = req.body.uploadType || 'images';
    const isProduction = process.env.NODE_ENV === 'production';
    let fileUrl;

    // Try Azure Blob Storage first
    if (azureStorage.isConfigured()) {
      try {
        // Read file from disk into buffer for Azure upload
        const fileBuffer = fs.readFileSync(req.file.path);
        
        const uploadResult = await azureStorage.uploadImage(
          fileBuffer,
          req.file.originalname,
          req.file.mimetype,
          uploadType
        );
        fileUrl = uploadResult.url;
        console.log('Image uploaded to Azure Blob Storage:', uploadResult.url);
        
        // Delete local file after successful Azure upload
        fs.unlinkSync(req.file.path);
      } catch (azureError) {
        console.error('Azure upload failed:', azureError.message);
        console.error('Error stack:', azureError.stack);
        
        // Log more details about the error
        if (azureError.message) {
          console.error('Error message:', azureError.message);
        }
        if (azureError.code) {
          console.error('Error code:', azureError.code);
        }
        
        // In production, try to use local storage as fallback (with warning)
        // This allows the app to continue working even if Azure Storage has issues
        console.warn('Falling back to local storage due to Azure Storage error');
        console.warn('NOTE: Local storage files will be lost on deployment!');
        
        try {
          const uploadsDir = path.join(__dirname, 'uploads', uploadType);
          if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
          }
          fileUrl = `/uploads/${uploadType}/${req.file.filename}`;
          console.log('Saved to local storage:', fileUrl);
        } catch (localError) {
          console.error('Local storage also failed:', localError.message);
          return res.status(500).json({ 
            error: 'Failed to upload image. Both Azure Storage and local storage failed.',
            azureError: azureError.message,
            localError: localError.message,
            suggestion: 'Please check Azure Storage configuration in Azure App Service App Settings.'
          });
        }
      }
    } else {
      // Azure not configured - check if connection string exists
      const hasConnectionString = !!process.env.AZURE_STORAGE_CONNECTION_STRING;
      console.warn(`Azure Storage not configured. Connection string present: ${hasConnectionString}`);
      
      if (isProduction && hasConnectionString) {
        console.error('Azure Storage connection string is set but initialization failed!');
        console.error('Please check the connection string format and Azure Storage account status.');
      }
      
      // Use local storage as fallback
      console.warn('Using local storage (files will be lost on deployment)');
      try {
        const uploadsDir = path.join(__dirname, 'uploads', uploadType);
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }
        fileUrl = `/uploads/${uploadType}/${req.file.filename}`;
        console.log('Saved to local storage:', fileUrl);
      } catch (localError) {
        console.error('Local storage failed:', localError.message);
        return res.status(500).json({ 
          error: 'Failed to upload image. Azure Storage is not configured and local storage failed.',
          suggestion: 'Please set AZURE_STORAGE_CONNECTION_STRING in Azure App Service App Settings.'
        });
      }
    }
    
    res.json({ 
      success: true, 
      url: fileUrl,
      filename: req.file.filename
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Video upload endpoint
app.post('/api/upload-video', videoUpload.single('video'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const fileUrl = `/uploads/videos/${req.file.filename}`;
    
    res.json({ 
      success: true, 
      url: fileUrl,
      filename: req.file.filename,
      size: req.file.size
    });
  } catch (error) {
    console.error('Video upload error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Document/Slides upload endpoint
app.post('/api/upload-document', documentUpload.single('document'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const uploadType = req.body.uploadType || 'documents';
    const fileUrl = `/uploads/${uploadType}/${req.file.filename}`;
    
    res.json({ 
      success: true, 
      url: fileUrl,
      filename: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype
    });
  } catch (error) {
    console.error('Document upload error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/prayer-requests', prayerRoutes);
app.use('/api/sermons', sermonRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/content', contentRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;

