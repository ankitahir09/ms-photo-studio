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
let cachedDb = global.mongooseCachedConnection;
let cachedPromise = global.mongooseCachedPromise;

async function connectToDatabase() {
  if (cachedDb && mongoose.connection.readyState === 1) {
    return cachedDb;
  }
  if (!cachedPromise) {
    cachedPromise = mongoose
      .connect(process.env.MONGO_URI)
      .then((conn) => {
        console.log("✅ MongoDB connected (cached)");
        cachedDb = conn;
        global.mongooseCachedConnection = conn;
        return conn;
      })
      .catch((err) => {
        console.error("❌ MongoDB connection error:", err?.message || err);
        throw err;
      });
    global.mongooseCachedPromise = cachedPromise;
  }
  return cachedPromise;
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
