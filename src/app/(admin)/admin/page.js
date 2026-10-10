"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Forgot Password State
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [resetEmail, setResetEmail] = useState("");
  const [resetOtp, setResetOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

      if (!data.success) {
        toast.error(data.error || "Invalid credentials");
      } else {
        toast.success("Login successful");
        router.push("/upload");
      }
    } catch {
      toast.error("Login failed");
    } finally {
      setLoading(false);
    }
  };

  // Step 1: Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!resetEmail) {
      toast.error("Please enter your admin email");
      return;
    }

    setForgotLoading(true);
    try {
      const res = await fetch("/api/admin/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail }),
      });
      const data = await res.json();

      if (data.success) {
        toast.success(data.message || "OTP sent to your email!");
        setForgotStep(2);
      } else {
        toast.error(data.error || "Failed to send OTP");
      }
    } catch {
      toast.error("Error communicating with server");
    } finally {
      setForgotLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!resetOtp || resetOtp.length !== 6) {
      toast.error("Please enter the 6-digit OTP");
      return;
    }

    setForgotLoading(true);
    try {
      const res = await fetch("/api/admin/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail, otp: resetOtp }),
      });
      const data = await res.json();

      if (data.success) {
        toast.success("OTP verified! Now enter your new password.");
        setForgotStep(3);
      } else {
        toast.error(data.error || "Invalid OTP");
      }
    } catch {
      toast.error("Error verifying OTP");
    } finally {
      setForgotLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setForgotLoading(true);
    try {
      const res = await fetch("/api/admin/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: resetEmail,
          otp: resetOtp,
          newPassword,
        }),
      });
      const data = await res.json();

      if (data.success) {
        toast.success("Password reset successfully! Please sign in.");
        // Reset states and close modal
        setIsForgotModalOpen(false);
        setForgotStep(1);
        setResetEmail("");
        setResetOtp("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(data.error || "Failed to reset password");
      }
    } catch {
      toast.error("Error resetting password");
    } finally {
      setForgotLoading(false);
    }
  };

  const closeForgotModal = () => {
    setIsForgotModalOpen(false);
    setForgotStep(1);
    setResetOtp("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white p-8 rounded-2xl shadow-2xl border border-gray-100">
        <div className="text-center mb-8">
          <Image
            src="/logo.png"
            alt="Logo"
            width={120}
            height={120}
            className="mx-auto mb-4 filter drop-shadow-md"
          />
          <h2 className="text-2xl font-bold font-cormorant text-gray-900">
            Admin Portal
          </h2>
          <p className="text-sm text-gray-500 font-nunito mt-1">
            Sign in to manage your studio
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 font-nunito mb-1">
              Username
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-(--color-gold-500) focus:border-transparent outline-none transition-all text-sm"
              placeholder="Enter username"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700 font-nunito">
                Password
              </label>
              <button
                type="button"
                onClick={() => setIsForgotModalOpen(true)}
                className="text-xs text-[var(--color-gold-600)] hover:underline font-nunito font-semibold cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-(--color-gold-500) focus:border-transparent outline-none transition-all text-sm"
              placeholder="Enter password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#111] hover:bg-[#222] text-white py-3 rounded-lg font-nunito font-semibold transition-colors flex justify-center items-center h-12 cursor-pointer"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              "Sign In"
            )}
          </button>
        </form>
      </div>

      {/* Forgot Password Modal (3-Step Flow) */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl border border-gray-100 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={closeForgotModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-lg p-1 cursor-pointer"
            >
              ✕
            </button>

            {/* Stepper Header */}
            <div className="text-center mb-6">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-gold-600)]">
                Step {forgotStep} of 3
              </span>
              <h3 className="text-2xl font-bold font-cormorant text-gray-900 mt-1">
                {forgotStep === 1 && "Reset Your Password"}
                {forgotStep === 2 && "Enter Verification Code"}
                {forgotStep === 3 && "Create New Password"}
              </h3>
              <p className="text-xs text-gray-500 font-nunito mt-1">
                {forgotStep === 1 &&
                  "Enter your admin email and we'll send a 6-digit verification code."}
                {forgotStep === 2 &&
                  `We sent an OTP to ${resetEmail}. Check your inbox or console.`}
                {forgotStep === 3 &&
                  "Enter and confirm your new secure password."}
              </p>
            </div>

            {/* STEP 1: Enter Email */}
            {forgotStep === 1 && (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 font-nunito mb-1">
                    Admin Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="e.g. admin@murlidharstudio.in"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-(--color-gold-500) outline-none text-sm"
                    autoFocus
                  />
                </div>
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full bg-[#111] hover:bg-[#222] text-white py-3 rounded-lg font-nunito font-semibold text-sm transition flex justify-center items-center h-11 cursor-pointer"
                >
                  {forgotLoading ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    "Send Verification Code"
                  )}
                </button>
              </form>
            )}

            {/* STEP 2: Enter OTP */}
            {forgotStep === 2 && (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 font-nunito mb-1">
                    6-Digit OTP Code
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={resetOtp}
                    onChange={(e) => setResetOtp(e.target.value.replace(/\D/g, ""))}
                    placeholder="123456"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-(--color-gold-500) outline-none text-center text-2xl font-mono tracking-widest"
                    autoFocus
                  />
                  <p className="text-[11px] text-gray-400 mt-1 text-center">
                    Expires in 10 minutes &bull; Max 3 attempts
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={forgotLoading || resetOtp.length !== 6}
                  className="w-full bg-[#111] hover:bg-[#222] text-white py-3 rounded-lg font-nunito font-semibold text-sm transition flex justify-center items-center h-11 cursor-pointer disabled:opacity-50"
                >
                  {forgotLoading ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    "Verify Code"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setForgotStep(1)}
                  className="w-full text-xs text-gray-500 hover:text-gray-700 font-nunito py-1 text-center"
                >
                  Change Email or Resend
                </button>
              </form>
            )}

            {/* STEP 3: Set New Password */}
            {forgotStep === 3 && (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 font-nunito mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-(--color-gold-500) outline-none text-sm"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 font-nunito mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-(--color-gold-500) outline-none text-sm"
                  />
                </div>
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full bg-[#111] hover:bg-[#222] text-white py-3 rounded-lg font-nunito font-semibold text-sm transition flex justify-center items-center h-11 cursor-pointer"
                >
                  {forgotLoading ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    "Set New Password & Sign In"
                  )}
                </button>
              </form>
            )}

            <div className="mt-6 pt-4 border-t border-gray-100 text-center">
              <button
                type="button"
                onClick={closeForgotModal}
                className="text-xs text-gray-500 hover:text-gray-800 font-nunito cursor-pointer"
              >
                ← Back to Sign In
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
