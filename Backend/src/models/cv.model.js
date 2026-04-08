import mongoose from "mongoose";

const cvDocumentSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true },
    name: { type: String, required: true, trim: true },
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    resourceType: { type: String },
    format: { type: String },
    size: { type: Number },
    mimeType: { type: String },
    uploadedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const CvDocument = mongoose.model("CvDocument", cvDocumentSchema);