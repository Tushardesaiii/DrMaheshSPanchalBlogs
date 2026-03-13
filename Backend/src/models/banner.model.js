import mongoose from "mongoose";

const bannerSlideSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true },
    source: { type: String, enum: ["banner", "content"], default: "content" },
    url: { type: String, required: true },
    publicId: { type: String },
    resourceType: { type: String },
    format: { type: String },
    size: { type: Number },
    width: { type: Number },
    height: { type: Number },
  },
  { _id: false }
);

const bannerSettingsSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    designation: { type: String, required: true, trim: true },
    bio: { type: String, required: true, trim: true },
    qualifications: [{ type: String, trim: true }],
    phone: { type: String, trim: true },
    email: { type: String, trim: true },
    address: { type: String, trim: true },
    slides: [bannerSlideSchema],
  },
  { timestamps: true }
);

export const BannerSettings = mongoose.model("BannerSettings", bannerSettingsSchema);
