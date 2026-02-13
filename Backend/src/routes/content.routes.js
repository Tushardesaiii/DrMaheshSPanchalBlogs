import { Router } from "express";
import {
  createContent,
  getAllContent,
  getContentById,
  getContentBySection,
  updateContent,
  deleteContent,
} from "../controllers/content.controller.js";
import { verifyJWT, verifyAdmin } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// Logging middleware for content routes
router.use((req, res, next) => {
  if (req.method === 'POST' || req.method === 'PUT') {
    console.log(`\n📨 ${req.method} ${req.path}`);
    console.log('Headers:', req.headers);
  }
  next();
});

router.get("/", getAllContent);
router.get("/section/:section", getContentBySection);
router.get("/:id", getContentById);

router.post("/", verifyJWT, verifyAdmin, upload.array("files", 10), createContent);
router.put("/:id", verifyJWT, verifyAdmin, upload.array("files", 10), updateContent);
router.delete("/:id", verifyJWT, verifyAdmin, deleteContent);

export default router;
