import { Router } from "express";
import { ApiResponse } from "../utils/ApiResponse.js";

const router = Router();

router.get("/ping", (_req, res) => {
  return res.status(200).json(new ApiResponse(200, { ok: true }, "Admin access confirmed"));
});

export default router;
