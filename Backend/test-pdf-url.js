import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const testPdfUrl = "https://res.cloudinary.com/dciodsfb8/raw/upload/v1771785069/content/ADDMISION_LETTER-1771785067296_aotiz9.pdf";
const publicId = "content/ADDMISION_LETTER-1771785067296_aotiz9";

console.log("\n🔍 Testing PDF URL Access\n");
console.log("URL:", testPdfUrl);
console.log("\n");

// Test 1: Try to fetch the URL
console.log("📥 Test 1: Fetching URL with Node.js...\n");

try {
  const response = await fetch(testPdfUrl);
  console.log("Status:", response.status, response.statusText);
  console.log("Content-Type:", response.headers.get('content-type'));
  console.log("Content-Length:", response.headers.get('content-length'));
  
  if (response.status === 200) {
    console.log("✅ URL is accessible!\n");
  } else if (response.status === 401) {
    console.log("❌ 401 Unauthorized - File requires authentication\n");
  } else if (response.status === 404) {
    console.log("❌ 404 Not Found - File doesn't exist\n");
  } else {
    console.log("⚠️ Unexpected status code\n");
  }
} catch (error) {
  console.log("❌ Fetch error:", error.message, "\n");
}

// Test 2: Check the resource in Cloudinary
console.log("📋 Test 2: Checking resource details in Cloudinary...\n");

try {
  const resource = await cloudinary.api.resource(publicId, {
    resource_type: 'raw'
  });
  
  console.log("✅ Resource found in Cloudinary!\n");
  console.log("Details:");
  console.log("  - Public ID:", resource.public_id);
  console.log("  - Format:", resource.format);
  console.log("  - Bytes:", resource.bytes, `(${(resource.bytes / 1024 / 1024).toFixed(2)} MB)`);
  console.log("  - Created:", resource.created_at);
  console.log("  - Type:", resource.type);
  console.log("  - Access Mode:", resource.access_mode || "public");
  console.log("  - URL:", resource.secure_url);
  console.log("\n");
  
  if (resource.type === 'authenticated') {
    console.log("⚠️  ISSUE FOUND: File type is 'authenticated'");
    console.log("This means the file requires authentication to access.");
    console.log("\n💡 Solution: Need to change to type 'upload' for public access\n");
  } else if (resource.type === 'upload') {
    console.log("✅ File type is 'upload' - should be publicly accessible\n");
  }
  
} catch (error) {
  if (error.error && error.error.http_code === 404) {
    console.log("❌ Resource not found in Cloudinary");
    console.log("The file may have been deleted or the public ID is incorrect.\n");
  } else {
    console.log("❌ Error checking resource:", error.message, "\n");
  }
}

// Test 3: Generate a signed URL (fallback)
console.log("🔐 Test 3: Generating signed URL (fallback option)...\n");

try {
  const signedUrl = cloudinary.url(publicId, {
    resource_type: 'raw',
    type: 'upload',
    sign_url: true,
    secure: true
  });
  
  console.log("Signed URL:", signedUrl);
  console.log("\n💡 Try this signed URL if the original doesn't work.\n");
} catch (error) {
  console.log("❌ Error generating signed URL:", error.message, "\n");
}

process.exit(0);
