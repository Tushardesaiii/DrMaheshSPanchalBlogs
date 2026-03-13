import { BannerSettings } from "../models/banner.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";

const DEFAULT_BANNER_SETTINGS = {
  name: "Dr. Mahesh K. Solanki",
  designation: "University Librarian, Gujarat Technological University",
  bio: "With over 18 years in Library and Information Science, committed to research support, innovation, and modern digital library services.",
  qualifications: ["MLISc", "GSLET", "Ph.D. (LIS)"],
  phone: "+91 8401067372",
  email: "librarian@gtu.edu.in",
  address: "Central Library, GTU, Chandkheda, Ahmedabad",
  slides: [],
};

const parseStringArray = (value) => {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value
      .map((item) => String(item || "").trim())
      .filter(Boolean);
  }

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed.map((item) => String(item || "").trim()).filter(Boolean);
      }
    } catch {
      return value
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }

  return [];
};

const parseBoolean = (value) => value === true || value === "true";

const parseJsonArray = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value !== "string") return [];

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const normalizeSlide = (slide) => {
  const url = typeof slide?.url === "string" ? slide.url.trim() : "";
  if (!url) return null;

  const type = typeof slide?.type === "string" && slide.type.trim()
    ? slide.type.trim()
    : "image/jpeg";
  const publicId = typeof slide?.publicId === "string" ? slide.publicId.trim() : "";
  const sourceRaw = typeof slide?.source === "string" ? slide.source.trim().toLowerCase() : "";
  const source = sourceRaw === "banner" || sourceRaw === "content"
    ? sourceRaw
    : publicId.startsWith("banner/")
      ? "banner"
      : "content";

  return {
    name: typeof slide?.name === "string" && slide.name.trim() ? slide.name.trim() : "Banner Slide",
    type,
    source,
    url,
    ...(publicId && { publicId }),
    ...(typeof slide?.resourceType === "string" && slide.resourceType && { resourceType: slide.resourceType }),
    ...(typeof slide?.format === "string" && slide.format && { format: slide.format }),
    ...(Number.isFinite(slide?.size) && { size: slide.size }),
    ...(Number.isFinite(slide?.width) && { width: slide.width }),
    ...(Number.isFinite(slide?.height) && { height: slide.height }),
  };
};

const dedupeSlides = (slides) => {
  const seen = new Set();
  return slides.filter((slide) => {
    const key = slide.publicId || slide.url;
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const slideKey = (slide) => slide?.publicId || slide?.url || "";

const isBannerOwnedSlide = (slide) => {
  if (!slide) return false;
  if (slide.source === "banner") return true;
  const publicId = typeof slide.publicId === "string" ? slide.publicId : "";
  return publicId.startsWith("banner/");
};

const getOrCreateBannerSettings = async () => {
  let settings = await BannerSettings.findOne();
  if (!settings) {
    settings = await BannerSettings.create(DEFAULT_BANNER_SETTINGS);
  }
  return settings;
};

const getBannerSettings = asyncHandler(async (_req, res) => {
  const settings = await getOrCreateBannerSettings();
  return res
    .status(200)
    .json(new ApiResponse(200, settings, "Banner settings fetched successfully"));
});

const updateBannerSettings = asyncHandler(async (req, res) => {
  const settings = await getOrCreateBannerSettings();

  const {
    name,
    designation,
    bio,
    qualifications,
    phone,
    email,
    address,
    replaceSlides,
    selectedSlides,
  } = req.body;

  const currentSlides = Array.isArray(settings.slides) ? [...settings.slides] : [];
  const selectedSlidesPayload = parseJsonArray(selectedSlides)
    .map(normalizeSlide)
    .filter(Boolean);

  let slides = selectedSlides !== undefined
    ? dedupeSlides(selectedSlidesPayload)
    : [...currentSlides];

  const uploadedSlides = [];
  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      const cloudinaryResponse = await uploadOnCloudinary(
        file.path,
        {
          originalname: file.originalname,
          mimetype: file.mimetype,
        },
        {
          folder: "banner",
        }
      );

      if (!cloudinaryResponse) {
        throw new ApiError(500, `Failed to upload slide: ${file.originalname}`);
      }

      uploadedSlides.push({
        name: cloudinaryResponse.originalFilename,
        type: cloudinaryResponse.mimeType,
        source: "banner",
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

  const shouldReplaceSlides = parseBoolean(replaceSlides);
  if (shouldReplaceSlides && selectedSlides === undefined) {
    slides = [];
  }

  if (uploadedSlides.length > 0) {
    slides = [...slides, ...uploadedSlides];
  }

  slides = dedupeSlides(slides);

  const nextKeySet = new Set(slides.map((slide) => slideKey(slide)).filter(Boolean));
  const bannerSlidesToDelete = currentSlides
    .filter((slide) => isBannerOwnedSlide(slide))
    .filter((slide) => !nextKeySet.has(slideKey(slide)))
    .filter((slide) => slide.publicId);

  if (bannerSlidesToDelete.length > 0) {
    await Promise.all(
      bannerSlidesToDelete.map((slide) =>
        deleteFromCloudinary(slide.publicId, slide.resourceType || "image")
      )
    );
  }

  if (name !== undefined) settings.name = String(name).trim();
  if (designation !== undefined) settings.designation = String(designation).trim();
  if (bio !== undefined) settings.bio = String(bio).trim();
  if (qualifications !== undefined) {
    settings.qualifications = parseStringArray(qualifications);
  }
  if (phone !== undefined) settings.phone = String(phone).trim();
  if (email !== undefined) settings.email = String(email).trim();
  if (address !== undefined) settings.address = String(address).trim();
  settings.slides = slides;

  await settings.save();

  return res
    .status(200)
    .json(new ApiResponse(200, settings, "Banner settings updated successfully"));
});

export { getBannerSettings, updateBannerSettings };
