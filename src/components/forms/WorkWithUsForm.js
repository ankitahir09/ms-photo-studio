"use client";

import { useState } from "react";
import emailjs from "@emailjs/browser";
import toast, { Toaster } from "react-hot-toast";

export default function WorkWithUsForm() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await emailjs.sendForm(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID, // You may want a different template ID for this
        e.target,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
      );
      toast.success("Application sent successfully!");
      e.target.reset();
    } catch (error) {
      console.error(error);
      toast.error("Failed to send application. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 relative overflow-hidden">
      <Toaster position="top-right" />

      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--color-gold-500)] to-[var(--color-gold-700)]" />

      <h2 className="text-3xl font-cormorant text-gray-900 mb-6 font-bold">
        Submit Your Application
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative group">
            <input
              type="text"
              name="user_name"
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-500)] focus:bg-white transition-all peer pt-6 pb-2"
              placeholder=" "
            />
            <label className="absolute left-4 top-4 text-gray-400 font-nunito text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3.5 peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-[var(--color-gold-600)] pointer-events-none">
              Full Name
            </label>
          </div>

          <div className="relative group">
            <input
              type="tel"
              name="user_phone"
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-500)] focus:bg-white transition-all peer pt-6 pb-2"
              placeholder=" "
            />
            <label className="absolute left-4 top-4 text-gray-400 font-nunito text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3.5 peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-[var(--color-gold-600)] pointer-events-none">
              Phone Number
            </label>
          </div>
        </div>

        <div className="relative group">
          <input
            type="email"
            name="user_email"
            required
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-500)] focus:bg-white transition-all peer pt-6 pb-2"
            placeholder=" "
          />
          <label className="absolute left-4 top-4 text-gray-400 font-nunito text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3.5 peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-[var(--color-gold-600)] pointer-events-none">
            Email Address
          </label>
        </div>

        <div className="relative group">
          <select
            name="role"
            required
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-500)] focus:bg-white transition-all text-gray-700 font-nunito"
          >
            <option value="" disabled>
              Select Role
            </option>
            <option value="Photographer">Photographer</option>
            <option value="Videographer">Videographer</option>
            <option value="Video Editor">Video Editor</option>
            <option value="Photo Editor">Photo Editor</option>
            <option value="Intern">Intern</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="relative group">
          <input
            type="url"
            name="portfolio_link"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-500)] focus:bg-white transition-all peer pt-6 pb-2"
            placeholder=" "
          />
          <label className="absolute left-4 top-4 text-gray-400 font-nunito text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3.5 peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-[var(--color-gold-600)] pointer-events-none">
            Portfolio Link (Optional)
          </label>
        </div>

        <div className="relative group">
          <textarea
            name="message"
            required
            rows="4"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-500)] focus:bg-white transition-all peer pt-6 pb-2 resize-none"
            placeholder=" "
          ></textarea>
          <label className="absolute left-4 top-4 text-gray-400 font-nunito text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3.5 peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-[var(--color-gold-600)] pointer-events-none">
            Cover Letter / Message
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-[#111] hover:bg-[#222] text-white font-nunito font-semibold tracking-wider rounded-lg transition-colors flex justify-center items-center group relative overflow-hidden"
        >
          <span className="relative z-10 flex items-center gap-2">
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              "Submit Application"
            )}
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-gold-600)] to-[var(--color-gold-500)] opacity-0 group-hover:opacity-20 transition-opacity" />
        </button>
      </form>
    </div>
  );
}
