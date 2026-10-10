import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Admin from "@/lib/models/Admin";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { email, otp, newPassword } = await req.json();

    if (!email || !otp || !newPassword) {
      return NextResponse.json(
        { success: false, error: "Email, OTP, and new password are required" },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, error: "New password must be at least 6 characters long" },
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

    // Check expiry
    if (new Date() > new Date(admin.resetOtpExpires)) {
      admin.resetOtp = null;
      admin.resetOtpExpires = null;
      admin.otpAttempts = 0;
      await admin.save();
      return NextResponse.json(
        { success: false, error: "Verification code has expired" },
        { status: 400 }
      );
    }

    // Check attempts limit
    if (admin.otpAttempts >= 3) {
      admin.resetOtp = null;
      admin.resetOtpExpires = null;
      admin.otpAttempts = 0;
      await admin.save();
      return NextResponse.json(
        { success: false, error: "Maximum attempts exceeded. Please request a new code." },
        { status: 429 }
      );
    }

    // Final verification of OTP
    if (admin.resetOtp !== cleanOtp) {
      admin.otpAttempts = (admin.otpAttempts || 0) + 1;
      await admin.save();
      return NextResponse.json(
        { success: false, error: "Invalid verification code" },
        { status: 400 }
      );
    }

    // Hash new password and update
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    admin.password = hashedPassword;
    admin.resetOtp = null;
    admin.resetOtpExpires = null;
    admin.otpAttempts = 0;
    await admin.save();

    return NextResponse.json({
      success: true,
      message: "Password reset successfully! Please sign in with your new password.",
    });
  } catch (error) {
    console.error("POST /api/admin/auth/reset-password Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to reset password" },
      { status: 500 }
    );
  }
}
