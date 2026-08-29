"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import LogoLoader from "@/components/layout/LogoLoader";

export default function HeroSlideshow({ slides }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!slides || slides.length === 0) return;
    
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 6000); 

    return () => clearInterval(timer);
  }, [slides]);

  useEffect(() => {
    if (!slides || slides.length === 0) {
      setIsLoading(false);
      return;
    }
  }, [slides]);

  if (!slides || slides.length === 0) {
    return (
      <>
        <LogoLoader isLoading={isLoading} />
        <div className="h-screen w-full bg-gray-100" />
      </>
    );
  }

  return (
    <>
      <LogoLoader isLoading={isLoading} />
      <div className="relative h-screen w-full overflow-hidden bg-white">
      {/* Slides */}
      <AnimatePresence initial={false}>
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: 1.05 }}
            transition={{ duration: 10, ease: "linear" }}
            className="w-full h-full relative"
          >
            <Image
              src={slides[currentIndex].url}
              alt="Murlidhar Studio Hero"
              fill
              className="object-cover"
              priority={currentIndex === 0}
              onLoad={() => {
                if (currentIndex === 0) {
                  setIsLoading(false);
                }
              }}
            />
            {/* Very light dark gradient overlay to keep text readable without making image too dark */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40" />
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none px-4">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-4xl md:text-7xl lg:text-8xl font-display font-bold text-white tracking-tight text-center drop-shadow-md"
        >
          Murlidhar Studio
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-6 text-lg md:text-xl font-sans font-medium text-white/90 tracking-wide text-center uppercase"
        >
          Premium Photography & Cinematography
        </motion.p>
      </div>

      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      >
        <span className="text-white/80 font-sans text-xs tracking-[0.2em] uppercase font-medium">Scroll</span>
        <div className="w-[1px] h-10 bg-white/50" />
      </motion.div>
    </div>
    </>
  );
}
