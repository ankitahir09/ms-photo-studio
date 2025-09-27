import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";

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
    cached.promise = mongoose.connect(process.env.MONGO_URI).then((mongoose) => mongoose);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Connect to database
    await connectToDatabase();
    
    const { public_id, category } = req.body;
    const Image = mongoose.models.Image || mongoose.model("Image", ImageSchema);

    // Delete the image
    await Image.deleteOne({ public_id, category });
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
  } catch (err) {
    console.error("❌ Delete failed:", err);
    res.status(500).json({ error: "Failed to delete image" });
  }
}
