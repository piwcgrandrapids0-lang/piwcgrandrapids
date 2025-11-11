const { BlobServiceClient } = require('@azure/storage-blob');
const crypto = require('crypto');

/**
 * Azure Blob Storage Service
 * Handles image uploads to Azure Blob Storage
 */

class AzureStorageService {
  constructor() {
    this.connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
    this.containerName = process.env.AZURE_STORAGE_CONTAINER_NAME || 'church-images';
    this.blobServiceClient = null;
    this.containerClient = null;
    
    // Initialize if connection string is available
    if (this.connectionString) {
      this.initialize();
    }
  }

  /**
   * Initialize Azure Blob Storage client
   */
  initialize() {
    try {
      this.blobServiceClient = BlobServiceClient.fromConnectionString(this.connectionString);
      this.containerClient = this.blobServiceClient.getContainerClient(this.containerName);
      console.log('Azure Blob Storage initialized');
    } catch (error) {
      console.error('Error initializing Azure Blob Storage:', error.message);
      this.blobServiceClient = null;
      this.containerClient = null;
    }
  }

  /**
   * Check if Azure Storage is configured and available
   */
  isConfigured() {
    return this.blobServiceClient !== null && this.containerClient !== null;
  }

  /**
   * Create container if it doesn't exist
   */
  async ensureContainer() {
    if (!this.isConfigured()) {
      throw new Error('Azure Storage is not configured');
    }

    try {
      const exists = await this.containerClient.exists();
      if (!exists) {
        await this.containerClient.create({
          access: 'blob' // Public read access for blobs
        });
        console.log(`Container "${this.containerName}" created`);
      }
    } catch (error) {
      console.error('Error ensuring container exists:', error.message);
      throw error;
    }
  }

  /**
   * Upload image to Azure Blob Storage
   * @param {Buffer} fileBuffer - File buffer
   * @param {string} originalFilename - Original filename
   * @param {string} mimetype - File MIME type
   * @param {string} category - Image category (gallery, profile, etc.)
   * @returns {Object} - Upload result with URL
   */
  async uploadImage(fileBuffer, originalFilename, mimetype, category = 'general') {
    if (!this.isConfigured()) {
      throw new Error('Azure Storage is not configured. Please set AZURE_STORAGE_CONNECTION_STRING in .env');
    }

    try {
      // Ensure container exists
      await this.ensureContainer();

      // Generate unique filename
      const fileExtension = originalFilename.split('.').pop();
      const uniqueId = crypto.randomBytes(16).toString('hex');
      const uniqueFilename = `${category}/${Date.now()}-${uniqueId}.${fileExtension}`;

      // Get blob client
      const blockBlobClient = this.containerClient.getBlockBlobClient(uniqueFilename);

      // Upload options
      const uploadOptions = {
        blobHTTPHeaders: {
          blobContentType: mimetype
        }
      };

      // Upload the file
      await blockBlobClient.upload(fileBuffer, fileBuffer.length, uploadOptions);

      // Get the URL
      const imageUrl = blockBlobClient.url;

      console.log(`Image uploaded to Azure: ${uniqueFilename}`);

      return {
        success: true,
        url: imageUrl,
        filename: uniqueFilename,
        size: fileBuffer.length,
        mimetype: mimetype
      };
    } catch (error) {
      console.error('Error uploading to Azure Blob Storage:', error.message);
      throw error;
    }
  }

  /**
   * Delete image from Azure Blob Storage
   * @param {string} blobName - Blob name/path
   * @returns {boolean} - Success status
   */
  async deleteImage(blobName) {
    if (!this.isConfigured()) {
      throw new Error('Azure Storage is not configured');
    }

    try {
      const blockBlobClient = this.containerClient.getBlockBlobClient(blobName);
      await blockBlobClient.delete();
      console.log(`Image deleted from Azure: ${blobName}`);
      return true;
    } catch (error) {
      console.error('Error deleting from Azure Blob Storage:', error.message);
      throw error;
    }
  }

  /**
   * Get image URL from blob name
   * @param {string} blobName - Blob name/path
   * @returns {string} - Image URL
   */
  getImageUrl(blobName) {
    if (!this.isConfigured()) {
      throw new Error('Azure Storage is not configured');
    }

    const blockBlobClient = this.containerClient.getBlockBlobClient(blobName);
    return blockBlobClient.url;
  }

  /**
   * List all images in a category
   * @param {string} prefix - Category prefix (e.g., 'gallery/')
   * @returns {Array} - List of blob names
   */
  async listImages(prefix = '') {
    if (!this.isConfigured()) {
      throw new Error('Azure Storage is not configured');
    }

    try {
      const blobs = [];
      for await (const blob of this.containerClient.listBlobsFlat({ prefix })) {
        blobs.push({
          name: blob.name,
          url: this.getImageUrl(blob.name),
          size: blob.properties.contentLength,
          lastModified: blob.properties.lastModified
        });
      }
      return blobs;
    } catch (error) {
      console.error('Error listing images from Azure:', error.message);
      throw error;
    }
  }
}

// Export singleton instance
const azureStorageService = new AzureStorageService();
module.exports = azureStorageService;

