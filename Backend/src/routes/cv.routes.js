import { Router } from "express";
import { getCv, updateCv } from "../controllers/cv.controller.js";
import { verifyJWT, verifyAdmin } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.get("/", getCv);
router.put("/", verifyJWT, verifyAdmin, upload.single("cvFile"), updateCv);

export default router;