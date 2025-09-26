// server.js
import express from "express";
import serverless from "serverless-http";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import cloudinary from "cloudinary";
import Image from "../backend/routes/Image.js"; // Mongoose Image model
import imagesRouter from "../backend/routes/ImageCategory.js";

// ------------------- Setup -------------------
dotenv.config();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "*" }));

// Cloudinary Config
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ------------------- Routes -------------------
import authRoute from "../backend/routes/auth.js";
import uploadRoute from "../backend/routes/upload.js";
import dataRoute from "../backend/routes/data.js";

app.use("/api/auth", authRoute);
app.use("/api/upload", uploadRoute);
app.use("/api/data", dataRoute);
app.use("/api/images", imagesRouter);

// ------------------- MongoDB -------------------
// Connect to MongoDB only if not already connected
if (mongoose.connection.readyState === 0) {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Atlas connected"))
    .catch((err) => {
      console.error("❌ MongoDB error", err);
      console.error("❌ MONGO_URI:", process.env.MONGO_URI ? "Set" : "Not set");
    });
}


// ------------------- API -------------------

// Delete Image
app.post("/api/delete-image", async (req, res) => {
  const { public_id, category } = req.body;

  try {
    // Delete the image
    await Image.deleteOne({ public_id, category });
    await cloudinary.v2.uploader.destroy(public_id);

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
});


// Update Image Order
app.post("/api/update-order", async (req, res) => {
  const { images } = req.body;
  if (!images || !Array.isArray(images)) {
    return res.status(400).json({ error: "Invalid request" });
  }

  try {
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
});


// ------------------ Local Development Server ------------------
const PORT = process.env.PORT || 5000;

// Only start the server if not in serverless environment
if (process.env.NODE_ENV !== 'production' || process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📡 API endpoints available at http://localhost:${PORT}/api`);
  });
}

// ------------------- Export for Vercel -------------------
export const handler = serverless(app);
export default app;