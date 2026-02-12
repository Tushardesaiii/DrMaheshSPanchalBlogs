import dotenv from "dotenv";
import connectDB from "../db/index.js";
import { User } from "../models/user.model.js";

dotenv.config({ path: "./.env" });

const adminSeed = {
  name: process.env.SEED_ADMIN_NAME || "Platform Admin",
  email: process.env.SEED_ADMIN_EMAIL || "admin@platform.com",
  password: process.env.SEED_ADMIN_PASSWORD || "ChangeMe123!",
  role: "admin",
};

const run = async () => {
  await connectDB();

  const existing = await User.findOne({ email: adminSeed.email.toLowerCase().trim() });

  if (existing) {
    console.log("Admin already exists:", existing.email);
    process.exit(0);
  }

  const user = await User.create(adminSeed);
  console.log("Admin created:", user.email);
  process.exit(0);
};

run().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
