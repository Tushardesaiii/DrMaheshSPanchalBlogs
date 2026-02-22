import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Content model
const fileSchema = new mongoose.Schema({
  name: String,
  type: String,
  url: String,
  publicId: String,
  resourceType: String,
  format: String,
  size: Number,
  width: Number,
  height: Number,
}, { _id: false });

const contentSchema = new mongoose.Schema({
  title: String,
  files: [fileSchema],
}, { timestamps: true });

const Content = mongoose.model("Content", contentSchema);

/**
 * Generate signed URL for untrusted accounts
 */
const generateSignedUrl = (publicId, resourceType) => {
  const expiresAt = Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 30); // 30 days
  
  return cloudinary.url(publicId, {
    resource_type: resourceType || 'raw',
    type: 'upload',
    sign_url: true,
    secure: true,
    expires_at: expiresAt
  });
};

/**
 * Extract public ID from Cloudinary URL
 */
const extractPublicId = (url) => {
  if (!url || !url.includes('cloudinary.com')) return null;
  
  try {
    const parts = url.split('/upload/');
    if (parts.length < 2) return null;
    
    const afterUpload = parts[1];
    // Remove version number (v1234567890/)
    const withoutVersion = afterUpload.replace(/^v\d+\//, '');
    
    return withoutVersion;
  } catch (error) {
    return null;
  }
};

const updateExistingFiles = async () => {
  try {
    console.log("\n🔄 Updating existing files to use signed URLs...\n");
    
    const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/mahesh_blog";
    await mongoose.connect(mongoUri);
    console.log("✅ Connected to MongoDB\n");
    
    const contents = await Content.find();
    
    if (contents.length === 0) {
      console.log("⚠️  No content found. Nothing to update.\n");
      process.exit(0);
    }
    
    console.log(`Found ${contents.length} content item(s)\n`);
    
    let totalUpdated = 0;
    
    for (const content of contents) {
      let updated = false;
      
      for (const file of content.files) {
        // Check if URL needs updating (not already signed)
        if (file.url && !file.url.includes('?_a=')) {
          console.log(`Updating file: ${file.name}`);
          
          // Extract public ID or use stored one
          const publicId = file.publicId || extractPublicId(file.url);
          
          if (publicId) {
            const signedUrl = generateSignedUrl(publicId, file.resourceType);
            file.url = signedUrl;
            updated = true;
            console.log(`  ✅ Generated signed URL`);
          } else {
            console.log(`  ⚠️  Could not extract public ID`);
          }
        }
      }
      
      if (updated) {
        await content.save();
        totalUpdated++;
        console.log(`  💾 Saved content: ${content.title}\n`);
      }
    }
    
    console.log(`\n✅ Updated ${totalUpdated} content item(s)\n`);
    console.log("🎉 All existing files now use signed URLs that work with untrusted accounts!\n");
    
    process.exit(0);
    
  } catch (error) {
    console.error("\n❌ Error:", error.message);
    process.exit(1);
  }
};

updateExistingFiles();
