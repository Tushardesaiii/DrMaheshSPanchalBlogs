import multer from "multer";
import path from "path";
import fs from "fs";

// Temporary storage directory for uploads before Cloudinary upload
const uploadDir = "./uploads";

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer disk storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Make filename unique with timestamp + original name
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext);
    cb(null, `${basename}-${Date.now()}${ext}`);
  },
});

// File filter to accept various file types for content uploads
const fileFilter = (req, file, cb) => {
  if (file.fieldname === "files") {
    // Accept common document, image, video formats and more
    const allowedTypes = /pdf|docx?|xlsx?|xls|csv|pptx?|txt|rtf|odt|ods|jpg|jpeg|png|gif|webp|svg|bmp|tiff|mp4|mov|avi|mkv|webm|mp3|wav|ogg/;
    const ext = path.extname(file.originalname).toLowerCase().replace(".", "");
    if (allowedTypes.test(ext)) {
      cb(null, true);
    } else {
      cb(new Error(`Unsupported file format: ${ext}`));
    }
  } else if (file.fieldname === "video") {
    // Accept common video formats
    const allowedVideoTypes = /mp4|mov|avi|mkv|webm/;
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedVideoTypes.test(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Unsupported video format!"));
    }
  } else if (file.fieldname === "thumbnail") {
    // Accept common image formats
    const allowedImageTypes = /jpeg|jpg|png|gif|webp/;
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedImageTypes.test(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Unsupported image format!"));
    }
  } else {
    cb(new Error("Unexpected field"));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 500 * 1024 * 1024, // Max 500MB for large files (adjust as needed)
  },
});
