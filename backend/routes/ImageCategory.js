import express from "express";
import mongoose from "mongoose";
import Image from "./Image.js";

const router = express.Router();

// GET all images for a given category
router.get("/:category", async (req, res) => {
  try {
    const { category } = req.params;

    // Check if database is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(500).json({ 
        error: "Database not connected", 
        mongoStatus: mongoose.connection.readyState 
      });
    }

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
});

export default router;