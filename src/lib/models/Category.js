import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String },
  coverImage: { type: String },
  route: { type: String },
  order: { type: Number, default: 0 },
  type: { type: String, enum: ["photo", "video"], default: "photo" },
  isActive: { type: Boolean, default: true },
});

export default mongoose.models.Category || mongoose.model("Category", CategorySchema);
