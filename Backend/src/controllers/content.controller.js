import { Content } from "../models/content.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const createContent = asyncHandler(async (req, res) => {
  console.log("\n=== CREATE CONTENT REQUEST ===");
  console.log("Body:", req.body);
  console.log("Files received:", req.files ? req.files.length : 0);
  console.log("User:", req.user?._id);
  
  const { title, description, format, sections, visibility, status, tags } = req.body;

  if (!title || !description) {
    console.error("Missing required fields: title or description");
    throw new ApiError(400, "Title and description are required");
  }

  let parsedSections = [];
  let parsedTags = [];

  // Parse sections safely
  try {
    if (!sections) {
      parsedSections = [];
    } else if (Array.isArray(sections)) {
      parsedSections = sections;
    } else if (typeof sections === 'string') {
      parsedSections = JSON.parse(sections);
    } else {
      parsedSections = [];
    }
  } catch (e) {
    console.error("Error parsing sections:", e.message, "Raw value:", sections);
    parsedSections = [];
  }

  // Parse tags safely
  try {
    if (!tags) {
      parsedTags = [];
    } else if (Array.isArray(tags)) {
      parsedTags = tags;
    } else if (typeof tags === 'string') {
      parsedTags = JSON.parse(tags);
    } else {
      parsedTags = [];
    }
  } catch (e) {
    console.error("Error parsing tags:", e.message, "Raw value:", tags);
    parsedTags = [];
  }

  console.log("Parsed sections:", parsedSections);
  console.log("Parsed tags:", parsedTags);

  let files = [];

  if (req.files && req.files.length > 0) {
    console.log("Processing", req.files.length, "files...");
    for (const file of req.files) {
      console.log("Uploading to Cloudinary:", file.originalname);
      const cloudinaryResponse = await uploadOnCloudinary(file.path, {
        resource_type: "auto",
        folder: "content",
      });

      if (cloudinaryResponse) {
        console.log("Cloudinary upload success:", cloudinaryResponse.secure_url);
        files.push({
          name: file.originalname,
          type: file.mimetype,
          url: cloudinaryResponse.secure_url,
        });
      } else {
        console.warn("Cloudinary upload failed for:", file.originalname);
      }
    }
  }

  console.log("Creating content with files:", files.length);

  const content = await Content.create({
    title: title.trim(),
    description: description.trim(),
    format: format || "Article",
    sections: parsedSections,
    visibility: visibility || "Public",
    status: status || "Published",
    files,
    tags: parsedTags,
    author: req.user?.name || "Admin",
    createdBy: req.user?._id,
  });

  console.log("Content created successfully:", content._id);
  console.log("=== END CREATE CONTENT ===");

  return res.status(201).json(
    new ApiResponse(201, content, "Content created successfully")
  );
});

const getAllContent = asyncHandler(async (_req, res) => {
  const contents = await Content.find()
    .select("-createdBy")
    .sort({ createdAt: -1 });

  return res.status(200).json(
    new ApiResponse(200, contents, "Content fetched successfully")
  );
});

const getContentById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const content = await Content.findById(id).select("-createdBy");

  if (!content) {
    throw new ApiError(404, "Content not found");
  }

  return res.status(200).json(
    new ApiResponse(200, content, "Content fetched successfully")
  );
});

const getContentBySection = asyncHandler(async (req, res) => {
  const { section } = req.params;

  const contents = await Content.find({
    sections: section,
  })
    .select("-createdBy")
    .sort({ createdAt: -1 });

  return res.status(200).json(
    new ApiResponse(200, contents, `Content for section '${section}' fetched successfully`)
  );
});

const updateContent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description, format, sections, visibility, status, tags } = req.body;

  let files = undefined;

  if (req.files && req.files.length > 0) {
    files = [];
    for (const file of req.files) {
      const cloudinaryResponse = await uploadOnCloudinary(file.path, {
        resource_type: "auto",
        folder: "content",
      });

      if (cloudinaryResponse) {
        files.push({
          name: file.originalname,
          type: file.mimetype,
          url: cloudinaryResponse.secure_url,
        });
      }
    }
  }

  const content = await Content.findByIdAndUpdate(
    id,
    {
      ...(title && { title: title.trim() }),
      ...(description && { description: description.trim() }),
      ...(format && { format }),
      ...(sections && { sections: JSON.parse(sections) }),
      ...(visibility && { visibility }),
      ...(status && { status }),
      ...(files !== undefined && { files }),
      ...(tags && { tags: JSON.parse(tags) }),
    },
    { new: true }
  );

  if (!content) {
    throw new ApiError(404, "Content not found");
  }

  return res.status(200).json(
    new ApiResponse(200, content, "Content updated successfully")
  );
});

const deleteContent = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const content = await Content.findByIdAndDelete(id);

  if (!content) {
    throw new ApiError(404, "Content not found");
  }

  return res.status(200).json(
    new ApiResponse(200, {}, "Content deleted successfully")
  );
});

export { createContent, getAllContent, getContentById, getContentBySection, updateContent, deleteContent };
