import mongoose from "mongoose";

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
    await connectToDatabase();
    const state = mongoose.connection.readyState;
    const env = {
      hasMongoUri: Boolean(process.env.MONGO_URI),
      hasCloudinary: Boolean(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET)
    };
    res.json({ ok: true, mongoState: state, env });
  } catch (e) {
    res.status(500).json({ ok: false, error: e?.message || String(e) });
  }
}
