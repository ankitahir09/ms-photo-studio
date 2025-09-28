import mongoose from "mongoose";

// Image Schema
const ImageSchema = new mongoose.Schema({
  public_id: { type: String, required: true, index: true, unique: true },
  url: { type: String, required: true },
  category: { type: String, required: true, index: true },
  order: { type: Number, default: 0 }, // used for manual ordering
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

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Connect to database
    await connectToDatabase();
    
    const { category } = req.query;
    console.log("[images API] category received:", category);

    if (!category) {
      return res.status(400).json({ error: "Missing category in query params" });
    }

    // Check if database is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(500).json({ 
        error: "Database not connected", 
        mongoStatus: mongoose.connection.readyState 
      });
    }

    const Image = mongoose.models.Image || mongoose.model("Image", ImageSchema);
    const images = await Image.find({ category }).sort({ order: 1, uploadedAt: -1 });
    console.log(`[images API] found ${images.length} images for category:`, category);

    // Always return JSON, even if empty array
    res.setHeader('Content-Type', 'application/json');
    console.log("Returning images:", images.map(i => i.public_id));
res.status(200).json({
  success: true,
  category,
  count: images.length,
  images
});

  } catch (err) {
    console.error("Error fetching images:", err);
    res.status(500).json({ error: "Failed to fetch images", details: err.message });
  }
}
