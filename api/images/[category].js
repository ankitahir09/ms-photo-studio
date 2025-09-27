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
let cachedDb = global.mongooseCachedConnection;
let cachedPromise = global.mongooseCachedPromise;

async function connectToDatabase() {
  if (cachedDb && mongoose.connection.readyState === 1) {
    return cachedDb;
  }
  if (!cachedPromise) {
    cachedPromise = mongoose
      .connect(process.env.MONGO_URI, {
        // add options if needed
      })
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

    // Check if database is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(500).json({ 
        error: "Database not connected", 
        mongoStatus: mongoose.connection.readyState 
      });
    }

    const Image = mongoose.models.Image || mongoose.model("Image", ImageSchema);
    const images = await Image.find({ category }).sort({ order: 1, uploadedAt: -1 });
    
    // Always return JSON, even if empty array
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({
      success: true,
      category: category,
      count: images.length,
      images: images
    });
  } catch (err) {
    console.error("Error fetching images:", err);
    res.status(500).json({ error: "Failed to fetch images", details: err.message });
  }
}
