"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import Lightbox from "./Lightbox";

export default function PhotoGallery({ categoryId }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch(`/api/images?category=${categoryId}`);
        const data = await res.json();
        if (data.success) {
          setImages(data.images);
        }
      } catch (error) {
        console.error("Failed to fetch images", error);
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, [categoryId]);

  const handleNavigate = (dir) => {
    if (dir === "prev") {
      setLightboxIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
    } else {
      setLightboxIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <div className="w-12 h-12 border-4 border-gray-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <h3 className="text-2xl font-display font-medium text-gray-500 tracking-wide">
          Coming Soon
        </h3>
        <p className="text-gray-400 mt-2 font-sans">
          We are currently curating this collection.
        </p>
      </div>
    );
  }

  return (
    <>
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col gap-6 md:flex-row md:flex-wrap md:gap-4">
            {images.map((image, i) => (
              <motion.div
                key={image._id}
                initial={{ opacity: 1, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "50px" }}
                transition={{ duration: 0.5, delay: (i % 6) * 0.1 }}
                className="relative group cursor-pointer overflow-hidden rounded-lg bg-zinc-100 shadow-sm hover:shadow-xl transition-shadow w-full h-auto md:w-auto md:h-[320px] md:flex-grow"
                onClick={() => setLightboxIndex(i)}
              >
                <img
                  src={image.url.replace(
                    "/upload/",
                    "/upload/f_auto,q_auto,w_800/",
                  )}
                  alt="Gallery Photo"
                  className="w-full h-auto object-contain md:w-auto md:h-full md:min-w-full md:object-cover md:flex-grow transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:scale-110">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                      />
                    </svg>
                  </div>
                </div>
              </motion.div>
            ))}
            {/* Empty flex-grow spacer to prevent the last row from stretching excessively on desktop */}
            <div className="hidden md:block md:flex-grow-[99999] md:h-[320px]" />
          </div>
        </div>
      </section>

      <Lightbox
        images={images}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={handleNavigate}
      />
    </>
  );
}
