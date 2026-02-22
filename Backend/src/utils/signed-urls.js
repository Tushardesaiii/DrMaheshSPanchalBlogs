// ============================================
// SIGNED URL IMPLEMENTATION (Alternative Fix)
// ============================================
// Use this if you cannot change Cloudinary dashboard settings

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Generate a signed URL for a Cloudinary resource
 * This allows access to files even when account requires authentication
 * 
 * @param {string} publicId - Cloudinary public ID (without extension)
 * @param {string} resourceType - 'image', 'video', or 'raw'
 * @param {Object} options - Additional options
 * @returns {string} - Signed URL
 */
export const getSignedUrl = (publicId, resourceType = 'raw', options = {}) => {
  return cloudinary.url(publicId, {
    resource_type: resourceType,
    type: 'upload',
    sign_url: true,
    secure: true,
    expires_at: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 30), // 30 days
    ...options
  });
};

/**
 * Generate signed URL from an existing Cloudinary URL
 * Extracts public ID and generates new signed URL
 * 
 * @param {string} url - Existing Cloudinary URL
 * @param {string} resourceType - 'image', 'video', or 'raw'
 * @returns {string} - Signed URL
 */
export const convertToSignedUrl = (url, resourceType = 'raw') => {
  if (!url || !url.includes('cloudinary.com')) {
    return url;
  }
  
  try {
    // Extract public ID from URL
    // Example: https://res.cloudinary.com/cloud/raw/upload/v123/folder/file.ext
    const parts = url.split('/upload/');
    if (parts.length < 2) return url;
    
    const afterUpload = parts[1];
    // Remove version number if present (v1234567890/)
    const withoutVersion = afterUpload.replace(/^v\d+\//, '');
    // This is the public ID with extension
    const publicIdWithExt = withoutVersion;
    
    // Generate signed URL
    return getSignedUrl(publicIdWithExt, resourceType);
  } catch (error) {
    console.error('Error converting to signed URL:', error);
    return url;
  }
};

// ============================================
// HOW TO USE IN YOUR CONTROLLER
// ============================================

/*
// In content.controller.js, after uploading:

import { getSignedUrl } from '../utils/cloudinary.js';

const cloudinaryResponse = await uploadOnCloudinary(...);

if (cloudinaryResponse) {
  // Generate signed URL that expires in 30 days
  const signedUrl = getSignedUrl(
    cloudinaryResponse.publicId, 
    cloudinaryResponse.resourceType
  );
  
  files.push({
    name: cloudinaryResponse.originalFilename,
    type: cloudinaryResponse.mimeType,
    url: signedUrl, // Use signed URL instead
    publicId: cloudinaryResponse.publicId,
    resourceType: cloudinaryResponse.resourceType,
    // ... other fields
  });
}
*/

// ============================================
// HOW TO USE IN YOUR FRONTEND
// ============================================

/*
// In ContentDetails.jsx, when displaying files:

// Option 1: Signed URLs are already in database (if controller was updated)
<a href={file.url} target="_blank">Open</a>

// Option 2: Generate signed URLs on-the-fly (requires API endpoint)
// Create a backend endpoint that generates signed URLs:

// Backend: Add new route
app.get('/api/signed-url', authenticateMiddleware, (req, res) => {
  const { publicId, resourceType } = req.query;
  const signedUrl = getSignedUrl(publicId, resourceType);
  res.json({ url: signedUrl });
});

// Frontend: Fetch signed URL before opening
const openFile = async (file) => {
  const response = await fetch(
    `/api/signed-url?publicId=${file.publicId}&resourceType=${file.resourceType}`
  );
  const { url } = await response.json();
  window.open(url, '_blank');
};
*/

console.log("✅ Signed URL utilities ready to use");
console.log("📖 See comments in this file for implementation instructions");
