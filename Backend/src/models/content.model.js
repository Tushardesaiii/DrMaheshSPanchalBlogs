import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // Original filename
    type: { type: String, required: true }, // MIME type
    url: { type: String, required: true }, // Cloudinary URL
    publicId: { type: String }, // Cloudinary public ID for management
    resourceType: { type: String }, // image, video, raw
    format: { type: String }, // File format (jpg, pdf, xlsx, etc.)
    size: { type: Number }, // File size in bytes
    width: { type: Number }, // For images/videos
    height: { type: Number }, // For images/videos
  },
  { _id: false }
);

const contentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    format: { type: String, enum: ["Article", "PDF", "Report", "Guide", "Collection", "Event Notice"], default: "Article" },
    sections: [{ type: String }],
    files: [fileSchema],
    visibility: { type: String, enum: ["Public", "Members", "Internal"], default: "Public" },
    status: { type: String, enum: ["Draft", "Scheduled", "Published"], default: "Draft" },
    author: { type: String, default: "Admin" },
    tags: [String],
    // New fields for enhanced content management
    eventDate: { type: Date }, // Date for events, workshops, conferences
    location: { type: String, trim: true }, // Location for events (optional)
    eventTime: { 
      start: { type: String }, // Start time (e.g., "10:00 AM")
      end: { type: String }    // End time (e.g., "5:00 PM")
    },
    speaker: { type: String, trim: true }, // Speaker or author name for events
    externalUrl: { type: String, trim: true }, // Link to external resources
    featured: { type: Boolean, default: false }, // Mark as featured content
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export const Content = mongoose.model("Content", contentSchema);
