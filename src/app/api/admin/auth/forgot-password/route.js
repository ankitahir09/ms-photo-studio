import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Admin from "@/lib/models/Admin";
import { ensureAdminUserSeeded } from "@/lib/adminSeeder";
import { sendOtpEmail } from "@/lib/mailer";

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { success: false, error: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    await connectToDatabase();
    await ensureAdminUserSeeded();

    const admin = await Admin.findOne({
      $or: [
        { email: cleanEmail },
        { username: cleanEmail }
      ],
    });

    if (!admin) {
      return NextResponse.json(
        { success: false, error: "No admin user found with this email" },
        { status: 404 }
      );
    }

    // Generate 6-digit random OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Set 10-minute expiry and reset failed attempts
    admin.resetOtp = otp;
    admin.resetOtpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    admin.otpAttempts = 0;
    if (!admin.email) {
      admin.email = cleanEmail;
    }
    await admin.save();

    // Send via email utility
    await sendOtpEmail(admin.email, otp);

    return NextResponse.json({
      success: true,
      message: `A 6-digit verification code has been sent to ${admin.email}`,
    });
  } catch (error) {
    console.error("POST /api/admin/auth/forgot-password Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process forgot password request" },
      { status: 500 }
    );
  }
}
