// === Save Video URL API ===
// Saves video URL to MongoDB after direct Cloudinary upload
// Called by frontend after successful Cloudinary upload

import jwt from "jsonwebtoken";
import mongoose from "mongoose";

// Video Schema
const VideoSchema = new mongoose.Schema({
  public_id: { type: String, required: true, index: true, unique: true },
  url: { type: String, required: true },
  category: { type: String, required: true, index: true },
  uploadedAt: { type: Date, default: Date.now },
});

// Use global cache for mongoose connection
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MONGO_URI)
      .then((mongoose) => mongoose);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

const JWT_SECRET = process.env.JWT_SECRET;

// JWT verification middleware
function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }
    req.user = decoded;
    next();
  });
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await connectToDatabase();

    // Verify token
    verifyToken(req, res, async () => {
      const { public_id, url, category } = req.body;

      if (!public_id || !url || !category) {
        return res
          .status(400)
          .json({ error: "public_id, url, and category are required" });
      }

      try {
        const Video =
          mongoose.models.Video || mongoose.model("Video", VideoSchema);

        // Save to MongoDB
        const newVideo = new Video({
          public_id,
          url,
          category,
        });
        await newVideo.save();

        // Fetch videos for the same category
        const categoryVideos = await Video.find({ category }).sort({
          uploadedAt: -1,
        });

        res.json({
          message: "✅ Video saved successfully",
          success: true,
          videos: categoryVideos,
        });
      } catch (err) {
        console.error("Save error:", err);
        // If duplicate key error, video already exists
        if (err.code === 11000) {
          const Video =
            mongoose.models.Video || mongoose.model("Video", VideoSchema);
          const categoryVideos = await Video.find({ category }).sort({
            uploadedAt: -1,
          });
          return res.json({
            message: "✅ Video already exists",
            success: true,
            videos: categoryVideos,
          });
        }
        res.status(500).json({
          error: "Failed to save video",
          details: err.message,
        });
      }
    });
  } catch (error) {
    console.error("API error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

