import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import VideoModel from "@/lib/models/Video";
import cloudinary from "@/lib/cloudinary";
import { auth } from "@/lib/auth";

export async function GET(req) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    let query = {};
    if (category) {
      query.category = category;
    }

    const videos = await VideoModel.find(query).sort({ uploadedAt: -1 });
    return NextResponse.json({ success: true, videos });
  } catch (error) {
    console.error("GET Videos Error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch videos" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json({ success: false, error: "ID required" }, { status: 400 });
    }

    await connectToDatabase();
    const video = await VideoModel.findById(id);
    if (!video) {
      return NextResponse.json({ success: false, error: "Video not found" }, { status: 404 });
    }

    // Delete from cloudinary
    await cloudinary.uploader.destroy(video.public_id, { resource_type: "video" });
    
    // Delete from DB
    await VideoModel.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE Video Error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete video" }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { items } = await req.json();
    if (!items || !Array.isArray(items)) {
      return NextResponse.json({ success: false, error: "Invalid items data" }, { status: 400 });
    }

    await connectToDatabase();
    
    await Promise.all(
      items.map((item) =>
        VideoModel.findByIdAndUpdate(item._id, { order: item.order })
      )
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PUT Video Order Error:", error);
    return NextResponse.json({ success: false, error: "Failed to update order" }, { status: 500 });
  }
}
