// === Alternative: Unsigned Upload Preset Endpoint ===
// This provides an alternative method using Cloudinary's unsigned upload preset
// This is simpler but less secure - only use if you have an upload preset configured
// 
// To use this:
// 1. Create an unsigned upload preset in Cloudinary dashboard
// 2. Set UPLOAD_PRESET environment variable
// 3. Use this endpoint instead of the signed upload endpoint

import jwt from "jsonwebtoken";

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
    // Verify token
    verifyToken(req, res, async () => {
      const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;
      
      if (!uploadPreset) {
        return res.status(500).json({ 
          error: "Upload preset not configured. Please set CLOUDINARY_UPLOAD_PRESET environment variable." 
        });
      }

      res.json({
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        uploadPreset: uploadPreset,
        folder: req.body.folder || "murlidhar-studio/videos",
      });
    });
  } catch (error) {
    console.error("Signature generation error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

