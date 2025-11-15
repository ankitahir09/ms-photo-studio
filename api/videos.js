// === Unified Videos API ===
// Merged routes:
// - GET /api/videos (from api/videos/videos.js)
// - POST /api/videos (from api/upload/video.js)
// - DELETE /api/videos (from api/delete-video.js)
//
// This single handler manages all video CRUD operations to reduce serverless function count.

import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

// Video Schema
const VideoSchema = new mongoose.Schema({
  public_id: { type: String, required: true, index: true, unique: true },
  url: { type: String, required: true },
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

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer config - use memory storage for serverless
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100 MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    const validMimeTypes = [
      "video/mp4",
      "video/quicktime",
      "video/x-msvideo",
      "video/webm",
      "video/ogg",
    ];
    const validExtensions = [".mp4", ".mov", ".avi", ".webm", ".ogg"];
    const fileExtension =
      "." + file.originalname.split(".").pop().toLowerCase();

    if (
      validMimeTypes.includes(file.mimetype) ||
      validExtensions.includes(fileExtension)
    ) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Invalid file type. Only MP4, MOV, AVI, WEBM, and OGG files are allowed."
        ),
        false
      );
    }
  },
});

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

// Configure multer for the API route
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, DELETE, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  try {
    await connectToDatabase();

    // GET /api/videos - Fetch all videos
    if (req.method === "GET") {
      // Verify token for GET requests too
      verifyToken(req, res, async () => {
        try {
          if (mongoose.connection.readyState !== 1) {
            return res.status(500).json({
              error: "Database not connected",
              mongoStatus: mongoose.connection.readyState,
            });
          }

          const Video =
            mongoose.models.Video || mongoose.model("Video", VideoSchema);
          const videos = await Video.find().sort({ uploadedAt: -1 });

          res.status(200).json({
            success: true,
            count: videos.length,
            videos,
          });
        } catch (err) {
          console.error("Error fetching videos:", err);
          res.status(500).json({
            error: "Failed to fetch videos",
            details: err.message,
          });
        }
      });
      return;
    }

    // All other methods require authentication
    verifyToken(req, res, async () => {
      // POST /api/videos - Upload video
      if (req.method === "POST") {
        upload.single("video")(req, res, async (err) => {
          if (err) {
            console.error("Multer error:", err);
            if (err.code === "LIMIT_FILE_SIZE") {
              return res
                .status(400)
                .json({ error: "File size exceeds 100 MB limit" });
            }
            return res
              .status(400)
              .json({ error: err.message || "File upload error" });
          }

          if (!req.file) {
            return res.status(400).json({ error: "No video file provided" });
          }

          // Validate file size again (in bytes)
          const maxSize = 100 * 1024 * 1024; // 100 MB
          if (req.file.size > maxSize) {
            return res
              .status(400)
              .json({ error: "File size exceeds 100 MB limit" });
          }

          try {
            const Video =
              mongoose.models.Video || mongoose.model("Video", VideoSchema);

            // Upload to Cloudinary with video resource type
            const result = await new Promise((resolve, reject) => {
              cloudinary.uploader
                .upload_stream(
                  {
                    resource_type: "video",
                    folder: "murlidhar-studio/videos",
                    chunk_size: 6000000, // 6MB chunks for large videos
                  },
                  (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                  }
                )
                .end(req.file.buffer);
            });

            // Save to MongoDB
            const newVideo = new Video({
              public_id: result.public_id,
              url: result.secure_url,
            });
            await newVideo.save();

            // Fetch all videos
            const allVideos = await Video.find().sort({ uploadedAt: -1 });

            res.json({
              message: "✅ Video uploaded successfully",
              success: true,
              videos: allVideos,
            });
          } catch (err) {
            console.error("Upload error:", err);
            res
              .status(500)
              .json({ error: "Failed to upload video", details: err.message });
          }
        });
        return;
      }

      // DELETE /api/videos - Delete video
      if (req.method === "DELETE") {
        const { public_id } = req.body;

        if (!public_id) {
          return res.status(400).json({ error: "public_id is required" });
        }

        try {
          const Video =
            mongoose.models.Video || mongoose.model("Video", VideoSchema);

          // Delete from MongoDB
          await Video.deleteOne({ public_id });

          // Delete from Cloudinary (with resource_type: 'video')
          await cloudinary.uploader.destroy(public_id, {
            resource_type: "video",
          });

          // Fetch remaining videos
          const videos = await Video.find().sort({ uploadedAt: -1 });

          res.json({
            message: "✅ Video deleted successfully",
            success: true,
            videos,
          });
        } catch (err) {
          console.error("❌ Delete failed:", err);
          res.status(500).json({
            error: "Failed to delete video",
            details: err.message,
          });
        }
        return;
      }

      // Method not allowed
      res.status(405).json({ error: "Method not allowed" });
    });
  } catch (error) {
    console.error("API error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

