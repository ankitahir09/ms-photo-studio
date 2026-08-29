"use client";

import Image from "next/image";
import { motion } from "motion/react";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0d0d0d] gap-12">
      {/* Static/Elegant Logo */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative w-48 h-48 md:w-64 md:h-64"
      >
        <Image
          src="/logof.png"
          alt="Murlidhar Studio Logo"
          fill
          sizes="(max-width: 768px) 12rem, 16rem"
          className="object-contain"
          priority
        />
      </motion.div>

      {/* High-speed Circular Tracking Spinner */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="w-10 h-10 rounded-full border-4 border-[#222222] border-t-[#ff5722] animate-[spin_0.6s_linear_infinite]"
      />
    </div>
  );
}
