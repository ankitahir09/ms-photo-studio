import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Admin from "@/lib/models/Admin";

export async function POST(req) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json(
        { success: false, error: "Email and OTP are required" },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanOtp = otp.toString().trim();

    await connectToDatabase();

    const admin = await Admin.findOne({
      $or: [{ email: cleanEmail }, { username: cleanEmail }],
    });

    if (!admin || !admin.resetOtp) {
      return NextResponse.json(
        { success: false, error: "No active password reset request found" },
        { status: 400 }
      );
    }

    // Check expiration
    if (new Date() > new Date(admin.resetOtpExpires)) {
      admin.resetOtp = null;
      admin.resetOtpExpires = null;
      admin.otpAttempts = 0;
      await admin.save();
      return NextResponse.json(
        { success: false, error: "Verification code has expired. Please request a new one." },
        { status: 400 }
      );
    }

    // Check attempts limit (max 3 failed attempts)
    if (admin.otpAttempts >= 3) {
      admin.resetOtp = null;
      admin.resetOtpExpires = null;
      admin.otpAttempts = 0;
      await admin.save();
      return NextResponse.json(
        {
          success: false,
          error: "Maximum failed attempts exceeded. Code has been invalidated. Please request a new one.",
        },
        { status: 429 }
      );
    }

    // Compare OTP
    if (admin.resetOtp !== cleanOtp) {
      admin.otpAttempts = (admin.otpAttempts || 0) + 1;
      const remaining = 3 - admin.otpAttempts;

      if (remaining <= 0) {
        admin.resetOtp = null;
        admin.resetOtpExpires = null;
        admin.otpAttempts = 0;
        await admin.save();
        return NextResponse.json(
          {
            success: false,
            error: "Maximum failed attempts exceeded. Code has been invalidated. Please request a new one.",
          },
          { status: 429 }
        );
      }

      await admin.save();
      return NextResponse.json(
        {
          success: false,
          error: `Invalid verification code. ${remaining} attempt${remaining === 1 ? "" : "s"} remaining.`,
        },
        { status: 400 }
      );
    }

    // OTP is valid
    return NextResponse.json({
      success: true,
      message: "Verification code confirmed successfully",
    });
  } catch (error) {
    console.error("POST /api/admin/auth/verify-otp Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to verify code" },
      { status: 500 }
    );
  }
}
