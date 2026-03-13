import { Content } from "../models/content.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const ALLOWED_RESOURCE_PLATFORMS = new Set(["youtube", "instagram", "facebook", "other"]);
const ALLOWED_RECOGNITION_TYPES = new Set(["Achievement Award", "Appreciation Letter", "Certificate", "Social Activity", "Other"]);
const ALLOWED_AWARD_LEVELS = new Set(["State Level", "National Level", "International Level"]);

const isValidHttpUrl = (value) => {
  if (typeof value !== "string") return false;
  try {
    const parsed = new URL(value.trim());
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

const parseResourceLinks = (resourceLinks) => {
  if (!resourceLinks) return [];

  try {
    const parsed = Array.isArray(resourceLinks)
      ? resourceLinks
      : typeof resourceLinks === "string"
        ? JSON.parse(resourceLinks)
        : [];

    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Error parsing resourceLinks:", error.message, "Raw value:", resourceLinks);
    return [];
  }
};

const sanitizeResourceLinks = (resourceLinks = [], fallbackExternalUrl = undefined) => {
  const normalizedLinks = resourceLinks
    .map((link) => {
      const platformRaw = typeof link?.platform === "string" ? link.platform.toLowerCase().trim() : "other";
      const platform = ALLOWED_RESOURCE_PLATFORMS.has(platformRaw) ? platformRaw : "other";
      const url = typeof link?.url === "string" ? link.url.trim() : "";
      const label = typeof link?.label === "string" ? link.label.trim() : "";

      if (!url || !isValidHttpUrl(url)) return null;

      return {
        platform,
        url,
        ...(label && { label }),
      };
    })
    .filter(Boolean);

  const external = typeof fallbackExternalUrl === "string" ? fallbackExternalUrl.trim() : "";
  if (external && isValidHttpUrl(external)) {
    normalizedLinks.push({ platform: "other", url: external });
  }

  const seen = new Set();
  return normalizedLinks.filter((link) => {
    const key = `${link.platform}:${link.url.toLowerCase()}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const sanitizeRecognitionFields = ({ recognitionType, awardLevel, issuingOrganization }) => {
  const typeValue = typeof recognitionType === "string" ? recognitionType.trim() : "";
  const normalizedRecognitionType = ALLOWED_RECOGNITION_TYPES.has(typeValue) ? typeValue : undefined;

  const levelValue = typeof awardLevel === "string" ? awardLevel.trim() : "";
  const normalizedAwardLevel = ALLOWED_AWARD_LEVELS.has(levelValue) ? levelValue : undefined;

  const orgValue = typeof issuingOrganization === "string" ? issuingOrganization.trim() : "";
  const normalizedIssuingOrganization = orgValue || undefined;

  if (normalizedRecognitionType === "Achievement Award" && !normalizedAwardLevel) {
    throw new ApiError(400, "Award level is required for Achievement Award");
  }

  if (normalizedAwardLevel && normalizedRecognitionType !== "Achievement Award") {
    throw new ApiError(400, "Award level can only be used with Achievement Award");
  }

  return {
    normalizedRecognitionType,
    normalizedAwardLevel,
    normalizedIssuingOrganization,
  };
};

const createContent = asyncHandler(async (req, res) => {
  const { 
    title, 
    description, 
    format, 
    sections, 
    visibility, 
    status, 
    tags,
    eventDate,
    location,
    eventTimeStart,
    eventTimeEnd,
    speaker,
    recognitionType,
    awardLevel,
    issuingOrganization,
    externalUrl,
    resourceLinks,
    featured
  } = req.body;

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

  let files = [];

  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      // Pass file metadata to the upload function
      const cloudinaryResponse = await uploadOnCloudinary(
        file.path,
        {
          originalname: file.originalname,
          mimetype: file.mimetype,
        },
        {
          folder: "content",
        }
      );

      if (cloudinaryResponse) {
        files.push({
          name: cloudinaryResponse.originalFilename,
          type: cloudinaryResponse.mimeType,
          url: cloudinaryResponse.url,
          publicId: cloudinaryResponse.publicId,
          resourceType: cloudinaryResponse.resourceType,
          format: cloudinaryResponse.format,
          size: cloudinaryResponse.size,
          width: cloudinaryResponse.width,
          height: cloudinaryResponse.height,
        });
      } else {
        console.warn("Cloudinary upload failed for:", file.originalname);
      }
    }
  }

  // Prepare event time object if provided
  const eventTime = (eventTimeStart || eventTimeEnd) ? {
    start: eventTimeStart,
    end: eventTimeEnd
  } : undefined;

  const sanitizedExternalUrl = typeof externalUrl === "string" ? externalUrl.trim() : "";
  const parsedResourceLinks = parseResourceLinks(resourceLinks);
  const normalizedResourceLinks = sanitizeResourceLinks(parsedResourceLinks, sanitizedExternalUrl);
  const { normalizedRecognitionType, normalizedAwardLevel, normalizedIssuingOrganization } = sanitizeRecognitionFields({
    recognitionType,
    awardLevel,
    issuingOrganization,
  });

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
    // New fields
    ...(eventDate && { eventDate: new Date(eventDate) }),
    ...(location && { location: location.trim() }),
    ...(eventTime && { eventTime }),
    ...(speaker && { speaker: speaker.trim() }),
    ...(normalizedRecognitionType && { recognitionType: normalizedRecognitionType }),
    ...(normalizedAwardLevel && { awardLevel: normalizedAwardLevel }),
    ...(normalizedIssuingOrganization && { issuingOrganization: normalizedIssuingOrganization }),
    ...(sanitizedExternalUrl && { externalUrl: sanitizedExternalUrl }),
    ...(normalizedResourceLinks.length > 0 && { resourceLinks: normalizedResourceLinks }),
    ...(featured !== undefined && { featured: featured === 'true' || featured === true }),
  });

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
  const { 
    title, 
    description, 
    format, 
    sections, 
    visibility, 
    status, 
    tags,
    eventDate,
    location,
    eventTimeStart,
    eventTimeEnd,
    speaker,
    recognitionType,
    awardLevel,
    issuingOrganization,
    externalUrl,
    resourceLinks,
    featured
  } = req.body;

  let files = undefined;

  if (req.files && req.files.length > 0) {
    files = [];
    for (const file of req.files) {
      const cloudinaryResponse = await uploadOnCloudinary(
        file.path,
        {
          originalname: file.originalname,
          mimetype: file.mimetype,
        },
        {
          folder: "content",
        }
      );

      if (cloudinaryResponse) {
        files.push({
          name: cloudinaryResponse.originalFilename,
          type: cloudinaryResponse.mimeType,
          url: cloudinaryResponse.url,
          publicId: cloudinaryResponse.publicId,
          resourceType: cloudinaryResponse.resourceType,
          format: cloudinaryResponse.format,
          size: cloudinaryResponse.size,
          width: cloudinaryResponse.width,
          height: cloudinaryResponse.height,
        });
      }
    }
  }

  // Prepare event time object if provided
  const eventTime = (eventTimeStart || eventTimeEnd) ? {
    start: eventTimeStart,
    end: eventTimeEnd
  } : undefined;

  const sanitizedExternalUrl = typeof externalUrl === "string" ? externalUrl.trim() : "";
  const normalizedResourceLinks = resourceLinks !== undefined
    ? sanitizeResourceLinks(parseResourceLinks(resourceLinks), sanitizedExternalUrl)
    : undefined;
  const hasRecognitionInputs = recognitionType !== undefined || awardLevel !== undefined || issuingOrganization !== undefined;
  const recognition = hasRecognitionInputs
    ? sanitizeRecognitionFields({ recognitionType, awardLevel, issuingOrganization })
    : null;

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
      // New fields
      ...(eventDate && { eventDate: new Date(eventDate) }),
      ...(location !== undefined && { location: location ? location.trim() : null }),
      ...(eventTime && { eventTime }),
      ...(speaker !== undefined && { speaker: speaker ? speaker.trim() : null }),
      ...(recognitionType !== undefined && { recognitionType: recognition?.normalizedRecognitionType || null }),
      ...(awardLevel !== undefined && { awardLevel: recognition?.normalizedAwardLevel || null }),
      ...(issuingOrganization !== undefined && { issuingOrganization: recognition?.normalizedIssuingOrganization || null }),
      ...(externalUrl !== undefined && { externalUrl: sanitizedExternalUrl || null }),
      ...(normalizedResourceLinks !== undefined && { resourceLinks: normalizedResourceLinks }),
      ...(featured !== undefined && { featured: featured === 'true' || featured === true }),
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
