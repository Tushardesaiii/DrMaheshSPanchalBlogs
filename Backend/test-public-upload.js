import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log("\n🔧 Testing Public PDF Upload\n");
console.log("This will upload a test PDF and verify it's publicly accessible.\n");

const testUpload = async () => {
  try {
    // Create a test PDF content (simple text file with PDF extension)
    const testContent = "%PDF-1.4\nTest PDF for Cloudinary verification";
    const testFilePath = "./test-upload.pdf";
    
    fs.writeFileSync(testFilePath, testContent);
    console.log("✅ Created test file\n");
    
    console.log("📤 Uploading to Cloudinary...");
    console.log("Settings:");
    console.log("  - resource_type: raw");
    console.log("  - type: upload (PUBLIC)");
    console.log("  - folder: test\n");
    
    // Upload with EXPLICIT public settings
    const response = await cloudinary.uploader.upload(testFilePath, {
      resource_type: "raw",
      folder: "test",
      type: "upload", // This MUST be "upload" for public access
      use_filename: true,
      unique_filename: true,
      invalidate: true,
    });
    
    console.log("✅ Upload successful!\n");
    console.log("Response Details:");
    console.log("  - Public ID:", response.public_id);
    console.log("  - Resource Type:", response.resource_type);
    console.log("  - Type:", response.type, response.type === 'upload' ? '✓' : '⚠️ NOT UPLOAD!');
    console.log("  - Format:", response.format);
    console.log("  - Bytes:", response.bytes);
    console.log("  - URL:", response.secure_url);
    console.log("\n");
    
    // Test if the URL is accessible
    console.log("🔍 Testing URL accessibility...\n");
    
    const testResponse = await fetch(response.secure_url);
    console.log("  - Status:", testResponse.status, testResponse.statusText);
    
    if (testResponse.status === 200) {
      console.log("  ✅ SUCCESS! URL is publicly accessible without authentication!\n");
      console.log("🎉 Your Cloudinary is configured correctly for public uploads.\n");
      console.log("💡 Next Steps:");
      console.log("   1. Delete old content items with broken PDFs");
      console.log("   2. Restart your backend server");
      console.log("   3. Upload new PDFs - they should work now!\n");
    } else if (testResponse.status === 401) {
      console.log("  ❌ FAILED! Still getting 401 Unauthorized\n");
      console.log("🚨 ISSUE: Your Cloudinary account settings are forcing authentication.\n");
      console.log("📋 TO FIX:");
      console.log("   1. Login to Cloudinary: https://cloudinary.com/console");
      console.log("   2. Go to Settings > Security");
      console.log("   3. Check 'Strict Transformations':");
      console.log("      - Should be DISABLED for public uploads");
      console.log("   4. Check 'Delivery URL Signature':");
      console.log("      - Should be DISABLED unless you want signed URLs");
      console.log("   5. Check upload presets:");
      console.log("      - Settings > Upload > Upload presets");
      console.log("      - Ensure 'Signing Mode' is NOT 'authenticated'\n");
    } else {
      console.log("  ⚠️ Unexpected status:", testResponse.status, "\n");
    }
    
    // Clean up
    fs.unlinkSync(testFilePath);
    
    // Delete from Cloudinary
    console.log("🗑️  Cleaning up test file...");
    await cloudinary.uploader.destroy(response.public_id, { resource_type: 'raw' });
    console.log("✅ Test file removed\n");
    
  } catch (error) {
    console.error("\n❌ Test failed!");
    console.error("Error:", error.message);
    
    if (error.error && error.error.message) {
      console.error("Cloudinary Error:", error.error.message);
    }
    
    console.error("\nFull error:", error);
  }
  
  process.exit(0);
};

testUpload();
