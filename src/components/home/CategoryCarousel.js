"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import "swiper/css";
import "swiper/css/pagination";

export default function CategoryCarousel({ categories }) {
  if (!categories || categories.length === 0) return null;

  return (
    <section className="py-24 bg-white overflow-hidden relative">
      <div className="container mx-auto px-6 lg:px-12 mb-16 flex flex-col md:flex-row justify-between items-end">
        <div className="max-w-2xl">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4 tracking-tight"
          >
            Selected Works
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 font-sans text-lg"
          >
            Explore our diverse portfolio of professional photography and videography.
          </motion.p>
        </div>
      </div>

      <div className="container mx-auto px-6 lg:px-12">
        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={24}
          slidesPerView={1}
          speed={800}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true, dynamicBullets: true }}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          }}
          className="custom-swiper !pb-16"
        >
          {categories.map((cat, index) => (
            <SwiperSlide key={cat.slug || index}>
              <Link href={cat.route} className="block group w-full">
                <div className="relative h-[400px] w-full overflow-hidden rounded-lg bg-gray-100">
                  {cat.coverImage && (
                    <Image
                      src={cat.coverImage}
                      alt={cat.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )}
                  {/* Subtle dark gradient just for text legibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                
                <div className="mt-4 flex flex-col">
                  <span className="text-gray-400 font-sans text-sm tracking-widest uppercase font-medium mb-1">
                    {cat.type === 'video' ? 'Films' : 'Photography'}
                  </span>
                  <h3 className="text-2xl font-display font-semibold text-gray-900 capitalize group-hover:text-black transition-colors">
                    {cat.title}
                  </h3>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
