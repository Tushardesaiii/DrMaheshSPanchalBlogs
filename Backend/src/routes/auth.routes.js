import { Router } from "express";
import { loginAdmin, logoutAdmin, getMe } from "../controllers/auth.controller.js";
import { verifyJWT, verifyAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/login", loginAdmin);
router.post("/logout", verifyJWT, verifyAdmin, logoutAdmin);
router.get("/me", verifyJWT, verifyAdmin, getMe);

export default router;
