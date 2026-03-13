import { Router } from "express";
import { getBannerSettings, updateBannerSettings } from "../controllers/banner.controller.js";
import { verifyJWT, verifyAdmin } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.get("/", getBannerSettings);
router.put("/", verifyJWT, verifyAdmin, upload.array("slides", 10), updateBannerSettings);

export default router;
