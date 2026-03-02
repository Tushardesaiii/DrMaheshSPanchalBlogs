import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import contentRoutes from "./routes/content.routes.js";
import { verifyJWT, verifyAdmin } from "./middlewares/auth.middleware.js";

const app = express();

// --- CORS SETUP ---
const allowedOrigins = (process.env.CORS_ORIGIN?.split(",") || [])
  .map(origin => origin.trim())
  .map(origin => origin.replace(/\/$/, '')) // Remove trailing slashes that break routing
  .filter(Boolean);

// Fallback for dev: always allow localhost if no CORS_ORIGIN set
if (allowedOrigins.length === 0) {
  allowedOrigins.push("http://localhost:5173");
  allowedOrigins.push("http://localhost:3000");
  allowedOrigins.push("http://127.0.0.1:5173");
  allowedOrigins.push("http://127.0.0.1:3000");
}

console.log('🔒 CORS Configuration:');
console.log('  Allowed Origins:', allowedOrigins);
console.log('  Environment:', process.env.NODE_ENV || 'development');

const corsOptions = {
  origin: function (origin, callback) {
    console.log('📥 Incoming request from origin:', origin || 'NO ORIGIN (Postman/curl)');
    
    // Allow requests with no origin (like mobile apps, Postman, or curl)
    if (!origin) {
      console.log('✅ Allowing request with no origin');
      return callback(null, true);
    }
    
    // Normalize origin by removing trailing slash for comparison
    const normalizedOrigin = origin.replace(/\/$/, '');
    
    // Check if origin is allowed
    if (allowedOrigins.includes(normalizedOrigin) || allowedOrigins.includes('*')) {
      console.log('✅ Origin allowed:', origin);
      callback(null, true);
    } else {
      console.log('❌ Origin REJECTED:', origin);
      console.log('   Allowed origins are:', allowedOrigins);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Set-Cookie'],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Handle preflight requests

// --- Middleware ---
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// --- Health Check Route ---
app.get("/health", (req, res) => {
  res.status(200).json({ 
    status: "OK", 
    message: "Server is running",
    timestamp: new Date().toISOString(),
    cors: allowedOrigins
  });
});

// --- API Routes ---
app.use("/api/auth", authRoutes);
app.use("/api/admin", verifyJWT, verifyAdmin, adminRoutes);
app.use("/api/content", contentRoutes);

// --- Route Debugging Middleware ---
app.use((req, res, next) => {
  console.log(`🔍 ${req.method} ${req.url} - ${new Date().toISOString()}`);
  next();
});

// --- Multer and Upload Errors ---
app.use((err, req, res, next) => {
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
  next(err);
});

// --- Global Error Handler ---
app.use((err, req, res, next) => {
  // Set CORS headers for error responses
  res.header("Access-Control-Allow-Origin", req.headers.origin || "");
  res.header("Access-Control-Allow-Credentials", "true");

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || "Internal Server Error";

  console.error('Global error handler:', {
    statusCode,
    message,
    url: req.url,
    method: req.method,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined
  });

  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    data: null,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// --- 404 Handler ---
app.use("*", (req, res) => {
  console.log(`❌ 404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    availableRoutes: [
      "GET /health",
      "POST /api/auth/login",
      "POST /api/auth/logout",
      "GET /api/auth/me",
      "GET /api/content",
      "POST /api/content",
      "GET /api/admin/ping"
    ]
  });
});

export { app };
