import { NextResponse } from "next/server";
import crypto from "crypto";
import { auth } from "@/lib/auth";

export async function POST(req) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { timestamp, folder } = await req.json();

    if (!timestamp) {
      return NextResponse.json({ success: false, error: "Timestamp is required" }, { status: 400 });
    }

    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;

    if (!apiKey || !apiSecret || !cloudName) {
      return NextResponse.json({ success: false, error: "Cloudinary not configured" }, { status: 500 });
    }

    const folderPath = folder || "murlidhar-studio/videos";
    const resourceType = "video";

    const params = {
      api_key: String(apiKey),
      timestamp: String(timestamp),
      folder: String(folderPath),
      resource_type: String(resourceType),
    };

    const paramsString = Object.keys(params)
      .sort()
      .map((key) => `${key}=${params[key]}`)
      .join("&");
    
    const signature = crypto
      .createHash("sha1")
      .update(paramsString + apiSecret)
      .digest("hex");

    return NextResponse.json({
      success: true,
      signature,
      timestamp: timestamp.toString(),
      cloudName,
      apiKey,
      folder: folderPath,
      resource_type: resourceType,
    });
  } catch (error) {
    console.error("Video Signature Error:", error);
    return NextResponse.json({ success: false, error: "Failed to generate signature" }, { status: 500 });
  }
}
