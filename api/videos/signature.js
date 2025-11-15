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

      // Validate environment variables
      const apiKey = process.env.CLOUDINARY_API_KEY;
      const apiSecret = process.env.CLOUDINARY_API_SECRET;
      const cloudName = process.env.CLOUDINARY_CLOUD_NAME;

      if (!apiKey || !apiSecret || !cloudName) {
        return res.status(500).json({ 
          error: "Cloudinary credentials not configured. Please check environment variables." 
        });
      }

      const folderPath = folder || "murlidhar-studio/videos";
      const resourceType = "video";

      // Create signature for Cloudinary signed uploads
      // Cloudinary signature is SHA1 hash of sorted parameters + API secret
      // IMPORTANT: Only include parameters that will be sent in the upload request
      // Parameters must include: api_key, timestamp, folder, resource_type
      // Note: 'file' is NOT included in signature calculation
      // CRITICAL FIX: All values must be strings in the signature string
      const params = {
        api_key: String(apiKey),
        timestamp: String(timestamp), // Convert to string for signature
        folder: String(folderPath),
        resource_type: String(resourceType),
      };

      // Sort parameters alphabetically and create string
      // This exact format is required by Cloudinary
      const paramsString = Object.keys(params)
        .sort()
        .map((key) => `${key}=${params[key]}`)
        .join("&");
      
      // Generate SHA1 hash with API secret appended
      // This is the Cloudinary signature algorithm
      const signature = crypto
        .createHash("sha1")
        .update(paramsString + apiSecret)
        .digest("hex");
      
      // Debug logging (check server logs in production)
      console.log("=== Cloudinary Signature Debug ===");
      console.log("Params string:", paramsString);
      console.log("Signature (first 10 chars):", signature.substring(0, 10) + "...");
      console.log("Cloud name:", cloudName);
      console.log("API key:", apiKey);

      res.json({
        signature,
        timestamp: timestamp.toString(), // Send as string to frontend
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        apiKey: apiKey, // SECURITY NOTE: API key is safe to expose (not the secret)
        folder: folderPath,
        resource_type: resourceType,
      });
    });
  } catch (error) {
    console.error("Signature generation error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

