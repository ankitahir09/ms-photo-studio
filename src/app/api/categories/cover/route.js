import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import CategoryModel from "@/lib/models/Category";
import cloudinary from "@/lib/cloudinary";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function POST(req) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("image");
    const categoryId = formData.get("categoryId");

    if (!file || !categoryId) {
      return NextResponse.json(
        { success: false, error: "Missing image file or category ID" },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const category = await CategoryModel.findById(categoryId);
    if (!category) {
      return NextResponse.json(
        { success: false, error: "Category not found" },
        { status: 404 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const uploadResponse = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: `murlidhar-studio/category-covers` },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    const updatedCategory = await CategoryModel.findByIdAndUpdate(
      categoryId,
      { coverImage: uploadResponse.secure_url },
      { new: true }
    );

    revalidatePath("/");

    return NextResponse.json({
      success: true,
      coverImage: uploadResponse.secure_url,
      category: updatedCategory,
    });
  } catch (error) {
    console.error("POST Category Cover Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to upload category cover photo" },
      { status: 500 }
    );
  }
}
