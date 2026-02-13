import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true },
    url: { type: String, required: true },
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
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export const Content = mongoose.model("Content", contentSchema);
