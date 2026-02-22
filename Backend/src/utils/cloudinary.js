import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Detect file type and determine appropriate Cloudinary resource_type
 * @param {string} filePath - Path to the file
 * @param {string} mimeType - MIME type of the file
 * @returns {string} - Cloudinary resource type (image, video, raw, auto)
 */
const getResourceType = (filePath, mimeType) => {
  const ext = path.extname(filePath).toLowerCase();
  
  // Image files
  const imageExts = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.tiff'];
  const imageMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
  
  // Video files
  const videoExts = ['.mp4', '.mov', '.avi', '.mkv', '.webm', '.flv', '.wmv'];
  const videoMimes = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm'];
  
  // Audio files
  const audioExts = ['.mp3', '.wav', '.ogg', '.m4a'];
  const audioMimes = ['audio/mpeg', 'audio/wav', 'audio/ogg'];
  
  // Check if it's an image
  if (imageExts.includes(ext) || (mimeType && imageMimes.some(m => mimeType.includes(m)))) {
    return 'image';
  }
  
  // Check if it's a video
  if (videoExts.includes(ext) || (mimeType && videoMimes.some(m => mimeType.includes(m)))) {
    return 'video';
  }
  
  // Check if it's audio
  if (audioExts.includes(ext) || (mimeType && audioMimes.some(m => mimeType.includes(m)))) {
    return 'video'; // Cloudinary handles audio as video
  }
  
  // Everything else (PDFs, Excel, Word, etc.) should be 'raw'
  return 'raw';
};

/**
 * Upload a file to Cloudinary with proper resource type handling
 * @param {string} localFilePath - Path to the local file
 * @param {object} fileMetadata - Metadata about the file (originalname, mimetype)
 * @param {object} options - Additional Cloudinary upload options (optional)
 * @returns {Promise<object|null>} - Enhanced upload response with metadata or null if failed
 */
const uploadOnCloudinary = async (localFilePath, fileMetadata = {}, options = {}) => {
  try {
    if (!localFilePath) return null;

    // Determine the correct resource type
    const resourceType = getResourceType(localFilePath, fileMetadata.mimetype);
    
    console.log(`Uploading file: ${fileMetadata.originalname || localFilePath}`);
    console.log(`Detected resource type: ${resourceType}`);

    // Upload to Cloudinary with appropriate settings
    // CRITICAL: Ensure public delivery by avoiding access_mode and using type: upload
    const uploadOptions = {
      resource_type: resourceType,
      folder: options.folder || "content",
      type: "upload", // Must be 'upload' for public access (not 'authenticated' or 'private')
      use_filename: true,
      unique_filename: true,
      invalidate: true, // Invalidate CDN cache
    };
    
    // Explicitly remove any access control parameters that might cause auth issues
    // Do not merge options that might contain access_mode or type
    const { access_mode, type: optType, ...safeOptions } = options;
    
    const finalOptions = { ...uploadOptions, ...safeOptions };

    const response = await cloudinary.uploader.upload(localFilePath, finalOptions);

    // Clean up local file after successful upload
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    // Generate SIGNED URL for untrusted accounts
    // Regular secure_url won't work if account is marked as untrusted
    const signedUrl = getOptimizedUrl(response.public_id, response.resource_type);
    
    console.log(`Generated signed URL (expires in 30 days): ${signedUrl ? 'YES' : 'FAILED'}`);
    
    // Return enhanced response with SIGNED URL
    return {
      url: signedUrl || response.secure_url, // Fallback to regular URL if signing fails
      publicId: response.public_id,
      resourceType: response.resource_type,
      format: response.format,
      size: response.bytes,
      width: response.width,
      height: response.height,
      originalFilename: fileMetadata.originalname || path.basename(localFilePath),
      mimeType: fileMetadata.mimetype,
    };
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    console.error("File:", localFilePath);
    console.error("Error details:", error.message);

    // Clean up local file even on error
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    return null;
  }
};

/**
 * Generate a SIGNED URL for file delivery
 * REQUIRED for untrusted accounts - regular URLs are blocked
 * @param {string} publicId - Cloudinary public ID
 * @param {string} resourceType - Resource type (image, video, raw)
 * @param {object} transformations - Transformation options
 * @returns {string} - Signed URL with 30-day expiration
 */
const getOptimizedUrl = (publicId, resourceType, transformations = {}) => {
  try {
    const expiresAt = Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 30); // 30 days
    
    if (resourceType === 'image') {
      return cloudinary.url(publicId, {
        resource_type: 'image',
        type: 'upload',
        sign_url: true,
        secure: true,
        expires_at: expiresAt,
        transformation: [
          { quality: 'auto', fetch_format: 'auto' },
          transformations
        ]
      });
    } else if (resourceType === 'video') {
      return cloudinary.url(publicId, {
        resource_type: 'video',
        type: 'upload',
        sign_url: true,
        secure: true,
        expires_at: expiresAt,
        transformation: transformations
      });
    } else {
      // For raw files (PDFs, docs), return SIGNED URL
      return cloudinary.url(publicId, {
        resource_type: 'raw',
        type: 'upload',
        sign_url: true,
        secure: true,
        expires_at: expiresAt
      });
    }
  } catch (error) {
    console.error('Error generating signed URL:', error);
    return null;
  }
};

/**
 * Delete a file from Cloudinary
 * @param {string} publicId - Cloudinary public ID
 * @param {string} resourceType - Resource type (image, video, raw)
 * @returns {Promise<object|null>} - Deletion response or null if failed
 */
const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
  try {
    const response = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
    return response;
  } catch (error) {
    console.error("Cloudinary deletion error:", error);
    return null;
  }
};

export { uploadOnCloudinary, getOptimizedUrl, deleteFromCloudinary, getResourceType };
