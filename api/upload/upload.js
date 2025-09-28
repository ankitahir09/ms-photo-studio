// upload.js //
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
    // Connect to database
    await connectToDatabase();

    // Verify token
    verifyToken(req, res, async () => {
      // Use multer to parse the request
      upload.fields([{ name: "images", maxCount: 10 }])(
        req,
        res,
        async (err) => {
          if (err) {
            console.error("Multer error:", err);
            return res.status(400).json({ error: "File upload error" });
          }

          console.log("Upload route hit");
          const category = req.body.category;
          if (!category) {
            return res.status(400).json({ error: "No category is selected" });
          }

          try {
            const uploadedImages = [];
            const Image =
              mongoose.models.Image || mongoose.model("Image", ImageSchema);

            const files = req.files?.images || []; // ✅ multer stores files here

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
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
