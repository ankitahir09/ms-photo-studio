// === Unified Images API ===
// Merged routes:
// - GET /api/images (from api/images/images.js and api/images.js)
// - POST /api/images (from api/upload/upload.js)
// - PUT /api/images (from api/update-order.js)
// - DELETE /api/images (from api/delete-image.js)
//
// This single handler manages all image CRUD operations to reduce serverless function count.

import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

// Image Schema
const ImageSchema = new mongoose.Schema({
  public_id: { type: String, required: true, index: true, unique: true },
  url: { type: String, required: true },
  category: { type: String, required: true, index: true },
  order: { type: Number, default: 0 },
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
    "GET, POST, PUT, DELETE, OPTIONS"
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

    // GET /api/images - Fetch images by category
    if (req.method === "GET") {
      const { category } = req.query;

      if (!category) {
        return res.status(400).json({ error: "Missing category in query params" });
      }

      if (mongoose.connection.readyState !== 1) {
        return res.status(500).json({
          error: "Database not connected",
          mongoStatus: mongoose.connection.readyState,
        });
      }

      const Image =
        mongoose.models.Image || mongoose.model("Image", ImageSchema);
      const images = await Image.find({ category }).sort({
        order: 1,
        uploadedAt: -1,
      });

      res.status(200).json({
        success: true,
        category,
        count: images.length,
        images,
      });
      return;
    }

    // All other methods require authentication
    verifyToken(req, res, async () => {
      // POST /api/images - Upload images
      if (req.method === "POST") {
        upload.fields([{ name: "images", maxCount: 10 }])(
          req,
          res,
          async (err) => {
            if (err) {
              console.error("Multer error:", err);
              return res.status(400).json({ error: "File upload error" });
            }

            const category = req.body.category;
            if (!category) {
              return res.status(400).json({ error: "No category is selected" });
            }

            try {
              const uploadedImages = [];
              const Image =
                mongoose.models.Image || mongoose.model("Image", ImageSchema);

              const files = req.files?.images || [];

              for (let file of files) {
                const result = await new Promise((resolve, reject) => {
                  cloudinary.uploader
                    .upload_stream(
                      { folder: "murlidhar-studio" },
                      (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                      }
                    )
                    .end(file.buffer);
                });

                const newImage = new Image({
                  public_id: result.public_id,
                  url: result.secure_url,
                  category,
                });
                await newImage.save();
                uploadedImages.push(newImage);
              }

              const allImages = await Image.find({ category }).sort({
                order: 1,
                uploadedAt: -1,
              });

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
        return;
      }

      // PUT /api/images - Update image order
      if (req.method === "PUT") {
        const { images } = req.body;
        if (!images || !Array.isArray(images)) {
          return res.status(400).json({ error: "Invalid request" });
        }

        const Image =
          mongoose.models.Image || mongoose.model("Image", ImageSchema);
        const updates = images.map((img) =>
          Image.updateOne(
            { public_id: img.public_id },
            { $set: { order: img.order } }
          )
        );

        await Promise.all(updates);
        res.json({ message: "✅ Order updated" });
        return;
      }

      // DELETE /api/images - Delete image
      if (req.method === "DELETE") {
        const { public_id, category } = req.body;
        if (!public_id || !category) {
          return res
            .status(400)
            .json({ error: "public_id and category are required" });
        }

        const Image =
          mongoose.models.Image || mongoose.model("Image", ImageSchema);

        // Delete from MongoDB
        await Image.deleteOne({ public_id, category });
        // Delete from Cloudinary
        await cloudinary.uploader.destroy(public_id);

        // Get remaining images sorted by order
        let images = await Image.find({ category }).sort("order");

        // Re-assign order continuously (0,1,2,...)
        await Promise.all(
          images.map((img, index) =>
            Image.updateOne({ _id: img._id }, { $set: { order: index } })
          )
        );

        // Fetch again after reordering
        images = await Image.find({ category }).sort("order");

        res.json({ message: "✅ Deleted", images });
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
