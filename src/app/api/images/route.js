import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import ImageModel from "@/lib/models/Image";
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

    const images = await ImageModel.find(query).sort({ order: 1, uploadedAt: -1 });
    return NextResponse.json({ success: true, images });
  } catch (error) {
    console.error("GET Images Error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch images" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("image");
    const category = formData.get("category");

    if (!file || !category) {
      return NextResponse.json({ success: false, error: "Missing file or category" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    
    await connectToDatabase();

    const uploadResponse = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: `murlidhar-studio/${category}` },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    const newImage = new ImageModel({
      public_id: uploadResponse.public_id,
      url: uploadResponse.secure_url,
      category,
    });
    
    await newImage.save();

    return NextResponse.json({ success: true, image: newImage });
  } catch (error) {
    console.error("POST Image Error:", error);
    return NextResponse.json({ success: false, error: "Failed to upload image" }, { status: 500 });
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
    
    // Update all items in parallel
    await Promise.all(
      items.map((item) =>
        ImageModel.findByIdAndUpdate(item._id, { order: item.order })
      )
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PUT Image Order Error:", error);
    return NextResponse.json({ success: false, error: "Failed to update order" }, { status: 500 });
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
    const image = await ImageModel.findById(id);
    if (!image) {
      return NextResponse.json({ success: false, error: "Image not found" }, { status: 404 });
    }

    // Delete from cloudinary
    await cloudinary.uploader.destroy(image.public_id);
    
    // Delete from DB
    await ImageModel.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE Image Error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete image" }, { status: 500 });
  }
}
