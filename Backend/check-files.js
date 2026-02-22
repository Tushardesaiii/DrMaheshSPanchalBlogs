import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// Import Content model
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

const checkFiles = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/mahesh_blog";
    console.log("\n🔍 Connecting to MongoDB...\n");
    
    await mongoose.connect(mongoUri);
    console.log("✅ Connected!\n");
    
    console.log("📋 Checking uploaded files in database...\n");
    
    const contents = await Content.find().select("title files").limit(10);
    
    if (contents.length === 0) {
      console.log("⚠️  No content found in database.\n");
      process.exit(0);
    }
    
    contents.forEach((content, idx) => {
      console.log(`\n${idx + 1}. Title: ${content.title}`);
      console.log(`   Files: ${content.files.length}`);
      
      content.files.forEach((file, fileIdx) => {
        console.log(`\n   File ${fileIdx + 1}:`);
        console.log(`   - Name: ${file.name}`);
        console.log(`   - Type: ${file.type || "N/A"}`);
        console.log(`   - Resource Type: ${file.resourceType || "⚠️ NOT SET (OLD FILE)"}`);
        console.log(`   - URL: ${file.url}`);
        console.log(`   - Format: ${file.format || "N/A"}`);
        console.log(`   - Size: ${file.size ? (file.size / 1024 / 1024).toFixed(2) + " MB" : "N/A"}`);
      });
      console.log("\n" + "=".repeat(80));
    });
    
    console.log("\n\n🔎 Analysis:");
    
    const filesWithoutResourceType = contents.flatMap(c => 
      c.files.filter(f => !f.resourceType)
    );
    
    if (filesWithoutResourceType.length > 0) {
      console.log(`\n⚠️  Found ${filesWithoutResourceType.length} file(s) WITHOUT resourceType`);
      console.log("These are OLD files uploaded before the fix.");
      console.log("\n💡 Solution: Delete these content items and re-upload with the new code.\n");
    } else {
      console.log("\n✅ All files have resourceType set - they were uploaded with the new code!\n");
    }
    
    process.exit(0);
    
  } catch (error) {
    console.error("\n❌ Error:", error.message);
    process.exit(1);
  }
};

checkFiles();
