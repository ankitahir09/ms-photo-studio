import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import VideoModel from "@/lib/models/Video";
import { auth } from "@/lib/auth";

export async function POST(req) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { public_id, url, category } = await req.json();

    if (!public_id || !url || !category) {
      return NextResponse.json({ success: false, error: "Missing fields" }, { status: 400 });
    }

    await connectToDatabase();

    const newVideo = new VideoModel({
      public_id,
      url,
      category,
    });
    
    await newVideo.save();

    const videos = await VideoModel.find({ category }).sort({ uploadedAt: -1 });

    return NextResponse.json({ success: true, videos });
  } catch (error) {
    console.error("Video Save Error:", error);
    if (error.code === 11000) {
       // duplicate key
       return NextResponse.json({ success: false, error: "Video already exists" }, { status: 409 });
    }
    return NextResponse.json({ success: false, error: "Failed to save video" }, { status: 500 });
  }
}
