// models/Image.js
import mongoose from "mongoose";

const ImageSchema = new mongoose.Schema({
  public_id: { type: String, required: true, index: true, unique: true },
  url: { type: String, required: true },
  category: { type: String, required: true, index: true },
  order: { type: Number, default: 0 }, // used for manual ordering
  uploadedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Image", ImageSchema);