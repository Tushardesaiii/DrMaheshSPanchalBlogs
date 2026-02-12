import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const TOKEN_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRY || "7d";
const COOKIE_MAX_AGE_DAYS = Number(process.env.ACCESS_TOKEN_MAX_AGE_DAYS || 7);

const buildCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: COOKIE_MAX_AGE_DAYS * 24 * 60 * 60 * 1000,
});

const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() });

  if (!user || user.role !== "admin") {
    throw new ApiError(401, "Invalid credentials");
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    throw new ApiError(401, "Invalid credentials");
  }

  const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: TOKEN_EXPIRES_IN }
  );

  res.cookie("accessToken", token, buildCookieOptions());

  return res.status(200).json(
    new ApiResponse(200, {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    }, "Login successful")
  );
});

const logoutAdmin = asyncHandler(async (_req, res) => {
  res.clearCookie("accessToken", buildCookieOptions());
  return res.status(200).json(new ApiResponse(200, {}, "Logged out"));
});

const getMe = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }

  return res.status(200).json(
    new ApiResponse(200, {
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
      },
    }, "Authenticated")
  );
});

export { loginAdmin, logoutAdmin, getMe };
