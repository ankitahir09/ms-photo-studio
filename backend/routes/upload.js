// routes/upload.js
import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import jwt from "jsonwebtoken";
import Image from "./Image.js"; // adjust path if needed

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer config - use memory storage for serverless
const storage = multer.memoryStorage();
const upload = multer({ storage });

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

// Upload route (protected)
router.post(
  "/upload",
  verifyToken,
  upload.array("images", 10),
  async (req, res) => {
    console.log("Upload route hit");
    const category = req.body.category;
    if (!category) {
      return res.status(400).json({ error: "No category is selected" });
    }

    try {
      const uploadedImages = [];

      for (let file of req.files) {
        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            {
              folder: "murlidhar-studio",
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          ).end(file.buffer);
        });

        const newImage = new Image({
          public_id: result.public_id,
          url: result.secure_url,
          category,
        });
        await newImage.save();
        uploadedImages.push(newImage);
      }

      // 🔥 Get all images of this category after upload
      const allImages = await Image.find({ category }).sort({ order: 1, createdAt: -1 });

      res.json({
        message: "✅ Uploaded successfully",
        images: allImages,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to upload images" });
    }
  }
);


export default router;
