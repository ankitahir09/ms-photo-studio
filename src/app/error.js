"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error("Unhandled App Router error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center text-center px-4">
      <div className="relative z-10 max-w-lg">
        <h1 className="text-5xl md:text-6xl font-cormorant text-red-500 font-bold mb-4">
          Something went wrong
        </h1>
        <p className="text-gray-400 font-nunito mb-8 text-base">
          An unexpected error occurred while processing your request.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => reset()}
            className="px-6 py-3 bg-[var(--color-gold-500)] text-[#0a0a0a] rounded-md font-nunito font-semibold hover:bg-[var(--color-gold-600)] transition-all cursor-pointer"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="px-6 py-3 border border-gray-600 text-gray-300 rounded-md font-nunito hover:bg-gray-800 transition-all"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
