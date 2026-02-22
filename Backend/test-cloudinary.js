import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log("\n🔍 Testing Cloudinary Configuration\n");
console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("API Key:", process.env.CLOUDINARY_API_KEY ? "✓ Set" : "✗ Missing");
console.log("API Secret:", process.env.CLOUDINARY_API_SECRET ? "✓ Set" : "✗ Missing");

// Test: Upload a simple text file
console.log("\n📤 Testing file upload...\n");

const testUpload = async () => {
  try {
    // Create a test file
    const fs = await import("fs");
    const testContent = "This is a test file for Cloudinary upload verification.";
    const testFilePath = "./test-cloudinary-file.txt";
    
    fs.writeFileSync(testFilePath, testContent);
    
    console.log("Uploading test file...");
    
    // Upload as raw (for documents)
    const response = await cloudinary.uploader.upload(testFilePath, {
      resource_type: "raw",
      folder: "test",
      type: "upload", // Important: use 'upload' not 'authenticated'
      use_filename: true,
      unique_filename: true,
    });
    
    console.log("\n✅ Upload successful!\n");
    console.log("Public ID:", response.public_id);
    console.log("Resource Type:", response.resource_type);
    console.log("Format:", response.format);
    console.log("URL:", response.secure_url);
    console.log("\n🔗 Testing URL access...");
    console.log("Copy this URL and paste in browser:");
    console.log(response.secure_url);
    console.log("\nIf the URL downloads the file, everything is working! ✓");
    console.log("If you get a 401 error, check your Cloudinary dashboard settings.");
    
    // Clean up test file
    fs.unlinkSync(testFilePath);
    
    // Try to delete the uploaded file
    console.log("\n🗑️  Cleaning up test file from Cloudinary...");
    await cloudinary.uploader.destroy(response.public_id, {
      resource_type: "raw"
    });
    console.log("✅ Test file deleted from Cloudinary\n");
    
  } catch (error) {
    console.error("\n❌ Upload failed!");
    console.error("Error:", error.message);
    console.error("\nPossible issues:");
    console.error("1. Check your Cloudinary credentials in .env file");
    console.error("2. Verify your Cloudinary account is active");
    console.error("3. Check if your account has upload restrictions");
    console.error("\nFull error:");
    console.error(error);
  }
};

// Test: Check account details
console.log("\n🔐 Verifying Cloudinary API connection...\n");

const testConnection = async () => {
  try {
    const result = await cloudinary.api.ping();
    console.log("✅ API Connection successful!");
    console.log("Status:", result.status);
    
    // Now test upload
    await testUpload();
    
  } catch (error) {
    console.error("❌ API Connection failed!");
    console.error("Error:", error.message);
    console.error("\nPlease verify your credentials in Backend/.env:");
    console.error("CLOUDINARY_CLOUD_NAME=", process.env.CLOUDINARY_CLOUD_NAME);
    console.error("CLOUDINARY_API_KEY=", process.env.CLOUDINARY_API_KEY);
    console.error("CLOUDINARY_API_SECRET=", process.env.CLOUDINARY_API_SECRET ? "[hidden]" : "[missing]");
  }
};

testConnection();
