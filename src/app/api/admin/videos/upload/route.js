import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import VideoModel from "@/lib/models/Video";
import { auth } from "@/lib/auth";
import {
  uploadVideoToCloudinary,
  ALLOWED_VIDEO_FORMATS,
  MAX_VIDEO_SIZE_BYTES,
} from "@/lib/cloudinaryVideo";

export async function POST(req) {
  try {
    // 1. Authenticate admin
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2. Parse form data
    const formData = await req.formData();
    const file = formData.get("video") || formData.get("file");
    const title = formData.get("title") || "";
    const category = formData.get("category") || "videos";

    if (!file || typeof file === "string") {
      return NextResponse.json(
        { success: false, error: "No video file provided" },
        { status: 400 }
      );
    }

    // 3. Check file size
    if (file.size > MAX_VIDEO_SIZE_BYTES) {
      return NextResponse.json(
        {
          success: false,
          error: `File size exceeds the 100MB limit. Current size: ${(
            file.size /
            (1024 * 1024)
          ).toFixed(1)}MB`,
        },
        { status: 400 }
      );
    }

    // 4. Validate extension/format
    const fileName = file.name || "video.mp4";
    const extension = fileName.split(".").pop()?.toLowerCase();
    if (!extension || !ALLOWED_VIDEO_FORMATS.includes(extension)) {
      return NextResponse.json(
        {
          success: false,
          error: `Unsupported format. Allowed formats: ${ALLOWED_VIDEO_FORMATS.join(
            ", "
          ).toUpperCase()}`,
        },
        { status: 400 }
      );
    }

    // 5. Convert to Buffer and upload to Cloudinary under folder "videos"
    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadResult = await uploadVideoToCloudinary(buffer, {
      public_id: `${Date.now()}_${fileName.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "_")}`,
    });

    // 6. Save to MongoDB
    await connectToDatabase();
    const newVideo = new VideoModel({
      public_id: uploadResult.public_id,
      url: uploadResult.secure_url || uploadResult.url,
      title: title || fileName,
      format: uploadResult.format || extension,
      bytes: uploadResult.bytes || file.size,
      duration: uploadResult.duration || 0,
      category,
    });

    await newVideo.save();

    return NextResponse.json({
      success: true,
      message: "Video uploaded successfully",
      video: newVideo,
    });
  } catch (error) {
    console.error("POST /api/admin/videos/upload Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to upload video to Cloudinary",
      },
      { status: 500 }
    );
  }
}
