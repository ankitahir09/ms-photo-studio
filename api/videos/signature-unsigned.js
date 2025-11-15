// === Unsigned Upload Preset Endpoint ===
// Returns Cloudinary upload preset configuration for client-side unsigned uploads
// This avoids the need for signature generation and simplifies the upload flow
// 
// The preset "videos" should be configured in Cloudinary dashboard with:
// - Signing mode: Unsigned
// - Resource type: Video
// - Folder: murlidhar-studio/videos

import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

// JWT verification middleware - ensures only authenticated admins can upload
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
    // Verify token - only authenticated admins can get preset info
    verifyToken(req, res, async () => {
      const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
      
      if (!cloudName) {
        return res.status(500).json({ 
          error: "Cloudinary cloud name not configured. Please set CLOUDINARY_CLOUD_NAME environment variable." 
        });
      }

      // Use preset name from env variable, or default to "videos"
      // The preset "videos" should be created in Cloudinary dashboard
      const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET || "videos";

      res.json({
        cloudName: cloudName,
        uploadPreset: uploadPreset,
        folder: "murlidhar-studio/videos", // Matches preset configuration
      });
    });
  } catch (error) {
    console.error("Preset configuration error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

