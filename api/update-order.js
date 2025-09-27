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
    cached.promise = mongoose.connect(process.env.MONGO_URI).then((mongoose) => mongoose);
  }
  cached.conn = await cached.promise;
  return cached.conn;
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
