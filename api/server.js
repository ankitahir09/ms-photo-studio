import express from "express";
import serverless from "serverless-http";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

// Import routes
import authRoutes from "../backend/routes/auth.js";
import dataRoutes from "../backend/routes/data.js";
import imageRoutes from "../backend/routes/ImageCategory.js";
import uploadRoutes from "../backend/routes/upload.js";

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ------------------- Health Check ------------------- 
app.get("/api/health", async (req, res) => 
  { try { 
    const state = mongoose.connection.readyState; 
     const env = { hasMongoUri: Boolean(process.env.MONGODB_URI),
       hasCloudinary: Boolean(process.env.CLOUDINARY_CLOUD_NAME
         && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET)
         }; 
         res.json({ ok: true, mongoState: state, env }); 
        } catch (e) { res.status(500).json({ ok: false, error: e?.message || String(e) }); }
      });

// MongoDB connection
const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log("MongoDB connected successfully");
    }
  } catch (error) {
    console.error("MongoDB connection error:", error);
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
app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    message: "✅ Serverless backend is working!",
    timestamp: new Date().toISOString(),
    mongoStatus: mongoose.connection.readyState
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Export handler for Vercel
export default serverless(app);
