import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import ImageModel from "@/lib/models/Image";
import VideoModel from "@/lib/models/Video";
import CategoryModel from "@/lib/models/Category";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const [totalImages, totalVideos, allCategories] = await Promise.all([
      ImageModel.countDocuments(),
      VideoModel.countDocuments(),
      CategoryModel.find({}).lean(),
    ]);

    const activeCategories = allCategories.filter((c) => c.isActive).length;

    return NextResponse.json({
      success: true,
      stats: {
        totalImages,
        totalVideos,
        totalCategories: allCategories.length,
        activeCategories,
      },
    });
  } catch (error) {
    console.error("GET Analytics Error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch analytics" }, { status: 500 });
  }
}
