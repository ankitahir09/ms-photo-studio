import mongoose from "mongoose";

const VideoSchema = new mongoose.Schema(
  {
    public_id: { type: String, required: true, index: true, unique: true },
    url: { type: String, required: true },
    title: { type: String, default: "" },
    category: { type: String, default: "videos", index: true },
    format: { type: String, default: "" },
    bytes: { type: Number, default: 0 },
    duration: { type: Number, default: 0 },
    order: { type: Number, default: 0 },
    uploadedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.Video || mongoose.model("Video", VideoSchema);
