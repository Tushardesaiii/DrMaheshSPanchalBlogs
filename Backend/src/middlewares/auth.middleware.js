// src/middlewares/auth.middleware.js
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, _res, next) => {
  try {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

    console.log("verifyJWT: Checking token...", { hasToken: !!token, fromCookie: !!req.cookies?.accessToken, fromHeader: !!req.header("Authorization") });

    if (!token) {
      throw new ApiError(401, "Unauthorized request - No token provided");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log("verifyJWT: Token decoded successfully", { userId: decodedToken?._id });

    const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

    if (!user) {
      throw new ApiError(401, "Invalid Access Token - User not found");
    }

    console.log("verifyJWT: User loaded", { userId: user._id, role: user.role });
    req.user = user;
    next();
  } catch (error) {
    console.error("verifyJWT error:", error.message);
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});

export const verifyAdmin = asyncHandler(async (req, _res, next) => {
  console.log("verifyAdmin: Checking admin role...", { userId: req.user?._id, role: req.user?.role });
  
  if (!req.user || req.user.role !== "admin") {
    throw new ApiError(403, "Admin access required");
  }

  console.log("verifyAdmin: Admin verified");
  next();
});
