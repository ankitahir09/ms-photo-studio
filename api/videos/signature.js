// === Video Upload Signature API ===
// Generates Cloudinary upload signature for direct client-side uploads
// This avoids hitting Vercel's 4.5 MB request body limit

import jwt from "jsonwebtoken";
import crypto from "crypto";
import { v2 as cloudinary } from "cloudinary";

const JWT_SECRET = process.env.JWT_SECRET;

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
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
      const { timestamp, folder } = req.body;

      if (!timestamp) {
        return res.status(400).json({ error: "Timestamp is required" });
      }

      // Build parameters for signature
      // Note: api_key must be included in signature calculation
      const apiKey = process.env.CLOUDINARY_API_KEY;
      const folderPath = folder || "murlidhar-studio/videos";
      const resourceType = "video";

      // Create signature
      // Cloudinary signature is SHA1 hash of sorted parameters + API secret
      // Parameters must include: api_key, timestamp, folder, resource_type
      const params = {
        api_key: apiKey,
        timestamp,
        folder: folderPath,
        resource_type: resourceType,
      };

      const paramsString = Object.keys(params)
        .sort()
        .map((key) => `${key}=${params[key]}`)
        .join("&");
      const signature = crypto
        .createHash("sha1")
        .update(paramsString + process.env.CLOUDINARY_API_SECRET)
        .digest("hex");

      res.json({
        signature,
        timestamp,
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        apiKey: apiKey,
        folder: folderPath,
      });
    });
  } catch (error) {
    console.error("Signature generation error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

