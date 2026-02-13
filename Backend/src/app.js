import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import contentRoutes from "./routes/content.routes.js";
import { verifyJWT, verifyAdmin } from "./middlewares/auth.middleware.js";

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/admin", verifyJWT, verifyAdmin, adminRoutes);
app.use("/api/content", contentRoutes);

// Multer and other upload errors middleware
app.use((err, _req, res, _next) => {
  if (err.name === 'MulterError') {
    console.error('Multer error:', err);
    return res.status(400).json({
      statusCode: 400,
      message: err.message || 'File upload error',
      success: false,
      data: null,
    });
  }
  if (err.message && err.message.includes('Unsupported file format')) {
    console.error('File error:', err);
    return res.status(400).json({
      statusCode: 400,
      message: err.message,
      success: false,
      data: null,
    });
  }
  _next(err);
});

// Error handling middleware
app.use((err, _req, res, _next) => {
  console.error('Error caught by middleware:', {
    message: err.message,
    statusCode: err.statusCode,
    stack: err.stack,
    type: err.constructor.name,
  });

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || "Internal Server Error";
  
  res.status(statusCode).json({
    statusCode,
    message,
    success: false,
    data: null,
  });
});

export { app };
