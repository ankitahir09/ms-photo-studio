import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import VideoModel from "@/lib/models/Video";
import { auth } from "@/lib/auth";
import { deleteVideoFromCloudinary } from "@/lib/cloudinaryVideo";

export async function DELETE(req, { params }) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Video ID is required" },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const video = await VideoModel.findById(id);
    if (!video) {
      return NextResponse.json(
        { success: false, error: "Video not found" },
        { status: 404 }
      );
    }

    // Delete from Cloudinary
    try {
      if (video.public_id) {
        await deleteVideoFromCloudinary(video.public_id);
      }
    } catch (cldErr) {
      console.warn("Cloudinary video deletion warning:", cldErr);
    }

    // Delete from MongoDB
    await VideoModel.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Video deleted successfully from Cloudinary and database",
    });
  } catch (error) {
    console.error("DELETE /api/admin/videos/[id] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete video" },
      { status: 500 }
    );
  }
}
