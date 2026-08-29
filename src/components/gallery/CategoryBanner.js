"use client";

import { motion } from "motion/react";
import Image from "next/image";

export default function CategoryBanner({ data, title, description, coverImage }) {
  const displayTitle = data?.title || title;
  const displayDescription = data?.description || description;
  const displayCover = data?.coverImage || coverImage;
  return (
    <section className="relative w-full h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden bg-white mt-20">
      {displayCover && (
        <div className="absolute inset-0">
          <Image 
            src={displayCover} 
            alt={displayTitle || "Category"} 
            fill
            className="object-cover opacity-30" // Lower opacity to make text pop on minimal background
            priority
          />
        </div>
      )}
      
      <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-display font-bold text-gray-900 tracking-tight capitalize"
        >
          {displayTitle}
        </motion.h1>
        
        {displayDescription && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mt-6 text-lg font-sans font-light text-gray-600 max-w-2xl mx-auto"
          >
            {displayDescription}
          </motion.p>
        )}
      </div>

      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
