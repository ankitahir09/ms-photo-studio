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
    
    const { images } = req.body;
    if (!images || !Array.isArray(images)) {
      return res.status(400).json({ error: "Invalid request" });
    }

    const Image = mongoose.models.Image || mongoose.model("Image", ImageSchema);
    const updates = images.map((img) =>
      Image.updateOne(
        { public_id: img.public_id },
        { $set: { order: img.order } }
      )
    );

    await Promise.all(updates);
    res.json({ message: "✅ Order updated" });
  } catch (err) {
    console.error("❌ Order update failed:", err);
    res.status(500).json({ error: "Failed to update order" });
  }
}
