import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/db";
import cloudinary from "@/lib/cloudinary";

export async function GET() {
  const status = {
    uptime: process.uptime(),
    timestamp: Date.now(),
    database: "disconnected",
    cloudinary: "unknown",
  };

  try {
    await connectToDatabase();
    status.database = mongoose.connection.readyState === 1 ? "connected" : "disconnected";
  } catch (error) {
    status.database = "error";
    status.dbError = error.message;
  }

  try {
    // Simple ping to cloudinary to check config
    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY) {
      status.cloudinary = "configured";
    } else {
      status.cloudinary = "missing configuration";
    }
  } catch (error) {
    status.cloudinary = "error";
  }

  const isHealthy = status.database === "connected" && status.cloudinary === "configured";

  return NextResponse.json(status, {
    status: isHealthy ? 200 : 503,
  });
}
