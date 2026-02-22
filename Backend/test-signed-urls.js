import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log("\n🔐 Testing SIGNED URL Upload (For Untrusted Accounts)\n");

const testSignedUpload = async () => {
  try {
    const fs = await import("fs");
    const testContent = "%PDF-1.4\nTest PDF with signed URLs";
    const testFilePath = "./test-signed.pdf";
    
    fs.writeFileSync(testFilePath, testContent);
    console.log("✅ Created test PDF\n");
    
    // Upload
    console.log("📤 Uploading to Cloudinary...\n");
    const response = await cloudinary.uploader.upload(testFilePath, {
      resource_type: "raw",
      folder: "test",
      type: "upload",
    });
    
    console.log("Upload Response:");
    console.log("  - Public ID:", response.public_id);
    console.log("  - Regular URL:", response.secure_url);
    console.log("\n");
    
    // Generate SIGNED URL
    const expiresAt = Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 30);
    
    const signedUrl = cloudinary.url(response.public_id, {
      resource_type: 'raw',
      type: 'upload',
      sign_url: true,
      secure: true,
      expires_at: expiresAt
    });
    
    console.log("🔐 SIGNED URL (this should work!):");
    console.log(signedUrl);
    console.log("\n");
    
    // Test regular URL
    console.log("🧪 Testing REGULAR URL (will fail for untrusted accounts)...");
    const regularTest = await fetch(response.secure_url);
    console.log("  Status:", regularTest.status, regularTest.statusText);
    
    if (regularTest.status === 401) {
      console.log("  ❌ As expected: 401 Unauthorized (untrusted account)\n");
    }
    
    // Test signed URL
    console.log("🧪 Testing SIGNED URL (should work!)...");
    const signedTest = await fetch(signedUrl);
    console.log("  Status:", signedTest.status, signedTest.statusText);
    
    if (signedTest.status === 200) {
      console.log("  ✅ SUCCESS! Signed URL works even with untrusted account!\n");
      console.log("🎉 Your uploads will now work!\n");
      console.log("📋 Next steps:");
      console.log("   1. Restart your backend: npm run dev");
      console.log("   2. Update existing files: node update-to-signed-urls.js");
      console.log("   3. Upload new content - files will work!\n");
    } else {
      console.log("  ⚠️ Signed URL also failed. Status:", signedTest.status);
      console.log("\n🚨 This might require contacting Cloudinary support.\n");
    }
    
    // Clean up
    fs.unlinkSync(testFilePath);
    await cloudinary.uploader.destroy(response.public_id, { resource_type: 'raw' });
    console.log("🗑️  Test file cleaned up\n");
    
  } catch (error) {
    console.error("\n❌ Test failed!");
    console.error("Error:", error.message);
    
    if (error.error) {
      console.error("Cloudinary Error:", error.error.message);
    }
  }
  
  process.exit(0);
};

testSignedUpload();
