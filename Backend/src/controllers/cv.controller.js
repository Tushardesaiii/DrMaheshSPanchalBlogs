import { CvDocument } from "../models/cv.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";

const getStoredCv = async () => CvDocument.findOne().sort({ updatedAt: -1 });

const getCv = asyncHandler(async (_req, res) => {
  const cv = await getStoredCv();

  return res
    .status(200)
    .json(new ApiResponse(200, cv, "CV fetched successfully"));
});

const updateCv = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "CV file is required");
  }

  const existingCv = await getStoredCv();
  const title = typeof req.body?.title === "string" && req.body.title.trim()
    ? req.body.title.trim()
    : req.file.originalname.replace(/\.[^/.]+$/, "");

  const uploadedCv = await uploadOnCloudinary(
    req.file.path,
    {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
    },
    {
      folder: "cv",
    }
  );

  if (!uploadedCv) {
    throw new ApiError(500, "Failed to upload CV file");
  }

  const payload = {
    title,
    name: uploadedCv.originalFilename,
    url: uploadedCv.url,
    publicId: uploadedCv.publicId,
    resourceType: uploadedCv.resourceType,
    format: uploadedCv.format,
    size: uploadedCv.size,
    mimeType: uploadedCv.mimeType,
    uploadedAt: new Date(),
  };

  let cvDocument;
  if (existingCv) {
    if (existingCv.publicId) {
      await deleteFromCloudinary(existingCv.publicId, existingCv.resourceType || "raw");
    }

    Object.assign(existingCv, payload);
    cvDocument = await existingCv.save();
  } else {
    cvDocument = await CvDocument.create(payload);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, cvDocument, "CV updated successfully"));
});

export { getCv, updateCv };