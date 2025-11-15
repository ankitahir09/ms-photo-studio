// videos/videos.js //
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

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
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Connect to database
    await connectToDatabase();

    // Verify token
    verifyToken(req, res, async () => {
      try {
        // Check if database is connected
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
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

