"use client";

import { useState } from "react";
import emailjs from "@emailjs/browser";
import toast, { Toaster } from "react-hot-toast";

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await emailjs.sendForm(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
        e.target,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
      );
      toast.success("Message sent successfully!");
      e.target.reset();
    } catch (error) {
      console.error(error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 relative overflow-hidden">
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--color-gold-500)] to-[var(--color-gold-700)]" />
      
      <h2 className="text-3xl font-cormorant text-gray-900 mb-6 font-bold">Get In Touch</h2>
      
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
              Your Name
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
              Your Phone
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
            Your Email
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
            Your Message
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
              <>
                Send Message
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </>
            )}
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-gold-600)] to-[var(--color-gold-500)] opacity-0 group-hover:opacity-20 transition-opacity" />
        </button>
      </form>
    </div>
  );
}
