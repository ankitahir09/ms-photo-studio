import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import VideoModel from "@/lib/models/Video";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectToDatabase();
    const videos = await VideoModel.find().sort({ uploadedAt: -1, createdAt: -1 });

    return NextResponse.json({
      success: true,
      videos,
    });
  } catch (error) {
    console.error("GET /api/admin/videos Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch videos" },
      { status: 500 }
    );
  }
}
