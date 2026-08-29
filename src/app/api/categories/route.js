import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import CategoryModel from "@/lib/models/Category";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    await connectToDatabase();
    // Public fetch only active categories
    const categories = await CategoryModel.find().sort({
      order: 1,
    });
    return NextResponse.json({ success: true, categories });
  } catch (error) {
    console.error("GET Categories Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch categories" },
      { status: 500 },
    );
  }
}

export async function POST(req) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const data = await req.json();
    await connectToDatabase();

    const newCategory = new CategoryModel(data);
    await newCategory.save();

    return NextResponse.json({ success: true, category: newCategory });
  } catch (error) {
    console.error("POST Category Error:", error);
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: "Category slug must be unique" },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to create category" },
      { status: 500 },
    );
  }
}

export async function PUT(req) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const data = await req.json();

    // Check if it's an array for reordering
    if (Array.isArray(data)) {
      await connectToDatabase();
      await Promise.all(
        data.map((item) =>
          CategoryModel.findByIdAndUpdate(item._id, { order: item.order }),
        ),
      );
      return NextResponse.json({ success: true });
    }

    // Single item update
    const { _id, ...updateData } = data;
    if (!_id) {
      return NextResponse.json(
        { success: false, error: "ID required" },
        { status: 400 },
      );
    }

    await connectToDatabase();
    const updated = await CategoryModel.findByIdAndUpdate(_id, updateData, {
      new: true,
    });

    return NextResponse.json({ success: true, category: updated });
  } catch (error) {
    console.error("PUT Category Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update category" },
      { status: 500 },
    );
  }
}

export async function DELETE(req) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID required" },
        { status: 400 },
      );
    }

    await connectToDatabase();
    await CategoryModel.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE Category Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete category" },
      { status: 500 },
    );
  }
}
