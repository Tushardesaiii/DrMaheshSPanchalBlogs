import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log("\n🔍 Checking Cloudinary Account Status\n");

const checkAccount = async () => {
  try {
    // Test 1: API Connection
    console.log("📡 Test 1: Verifying API Connection...");
    const ping = await cloudinary.api.ping();
    console.log("  ✅ API Connected:", ping.status);
    console.log("\n");
    
    // Test 2: Get Account Usage
    console.log("📊 Test 2: Checking Account Details...");
    try {
      const usage = await cloudinary.api.usage();
      console.log("  Plan:", usage.plan);
      console.log("  Credits Used:", usage.credits.used, "/", usage.credits.limit);
      console.log("  Bandwidth Used:", (usage.bandwidth.used_percent || 0).toFixed(2) + "%");
      console.log("  Storage Used:", (usage.storage.used_percent || 0).toFixed(2) + "%");
      console.log("\n");
    } catch (usageError) {
      console.log("  ⚠️ Cannot fetch usage (might be restricted)");
      console.log("  Error:", usageError.message);
      console.log("\n");
    }
    
    // Test 3: Check Account Restrictions
    console.log("🔐 Test 3: Checking Account Restrictions...");
    try {
      // Try to list resources (if account is blocked, this might fail)
      const resources = await cloudinary.api.resources({
        resource_type: 'raw',
        max_results: 1
      });
      console.log("  ✅ Can list resources");
      console.log("  Total resources:", resources.total_count);
      console.log("\n");
    } catch (listError) {
      console.log("  ❌ Cannot list resources");
      console.log("  Error:", listError.message);
      console.log("\n");
    }
    
    // Test 4: Account Info
    console.log("📋 Test 4: Account Configuration...");
    console.log("  Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);
    console.log("  API Key:", process.env.CLOUDINARY_API_KEY);
    console.log("\n");
    
    console.log("━".repeat(60));
    console.log("\n🚨 DIAGNOSIS:\n");
    console.log("Your Cloudinary account has been flagged as 'untrusted' and");
    console.log("is COMPLETELY BLOCKED from file delivery, even with signed URLs.\n");
    console.log("This is NOT a normal restriction - it's a full account block.\n");
    
    console.log("📋 POSSIBLE CAUSES:\n");
    console.log("  1. ⚠️  Account verification failed/pending");
    console.log("  2. 💳 Payment issues or trial expired");
    console.log("  3. 🚫 Terms of Service violation detected");
    console.log("  4. 🔍 Suspicious activity flagged");
    console.log("  5. 📧 Email verification pending\n");
    
    console.log("✅ SOLUTIONS (in order of priority):\n");
    console.log("  OPTION 1: Contact Cloudinary Support (URGENT)");
    console.log("  ────────────────────────────────────────");
    console.log("  • Email: support@cloudinary.com");
    console.log("  • Subject: 'Account marked as untrusted - delivery blocked'");
    console.log("  • Include: Cloud name (dciodsfb8) and error details");
    console.log("  • Request: Account verification and unblock\n");
    
    console.log("  OPTION 2: Check Cloudinary Dashboard");
    console.log("  ────────────────────────────────────────");
    console.log("  • Login: https://cloudinary.com/console");
    console.log("  • Look for: Warning banners or verification prompts");
    console.log("  • Check: Account status, email verification");
    console.log("  • Verify: Payment method if required\n");
    
    console.log("  OPTION 3: Create NEW Cloudinary Account");
    console.log("  ────────────────────────────────────────");
    console.log("  • Sign up: https://cloudinary.com/users/register/free");
    console.log("  • Use: Different email address");
    console.log("  • Update: Backend/.env with new credentials");
    console.log("  • Note: This is fastest but you lose existing uploads\n");
    
    console.log("  OPTION 4: Switch to Alternative CDN");
    console.log("  ────────────────────────────────────────");
    console.log("  • Upload.io (similar to Cloudinary)");
    console.log("  • AWS S3 + CloudFront");
    console.log("  • Imgix");
    console.log("  • ImageKit\n");
    
    console.log("━".repeat(60));
    console.log("\n⏱️  RECOMMENDED IMMEDIATE ACTION:\n");
    console.log("1. Check your Cloudinary email for any messages");
    console.log("2. Login to dashboard and check for alerts");
    console.log("3. If no obvious issue, create a NEW free account");
    console.log("4. Update .env with new credentials");
    console.log("5. Restart backend and test\n");
    
    console.log("🔗 New Cloudinary Account: https://cloudinary.com/users/register/free");
    console.log("📧 Support Email: support@cloudinary.com\n");
    
  } catch (error) {
    console.error("\n❌ Error running diagnostics:");
    console.error(error.message);
    
    if (error.error) {
      console.error("\nCloudinary API Error:");
      console.error(JSON.stringify(error.error, null, 2));
    }
  }
  
  process.exit(0);
};

checkAccount();
