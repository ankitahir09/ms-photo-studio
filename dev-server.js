// dev-server.js - Development server for local API testing
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

// Import routes
import authRoutes from "./backend/routes/auth.js";
import dataRoutes from "./backend/routes/data.js";
import imageRoutes from "./backend/routes/ImageCategory.js";
import uploadRoutes from "./backend/routes/upload.js";

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// MongoDB connection
const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ms-photo-studio');
      console.log("✅ MongoDB connected successfully");
    }
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
  }
};

// Connect to database
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/data", dataRoutes);
app.use("/api/images", imageRoutes);
app.use("/api/upload", uploadRoutes);

// Health check route
app.get("/api/health", async (req, res) => {
  try {
    const state = mongoose.connection.readyState;
    const env = {
      hasMongoUri: Boolean(process.env.MONGODB_URI),
      hasCloudinary: Boolean(
        process.env.CLOUDINARY_CLOUD_NAME &&
        process.env.CLOUDINARY_API_KEY &&
        process.env.CLOUDINARY_API_SECRET
      ),
      hasJwtSecret: Boolean(process.env.JWT_SECRET),
      hasAdminCreds: Boolean(process.env.ADMIN_USERNAME && process.env.ADMIN_PASSWORD)
    };
    res.json({ ok: true, mongoState: state, env, message: "Development server running!" });
  } catch (e) {
    res.status(500).json({ ok: false, error: e?.message || String(e) });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Development API server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔐 Admin login: http://localhost:${PORT}/api/auth/login`);
});
