"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";

export default function AboutSection() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          <div className="w-full lg:w-1/2 relative">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="relative aspect-[3/4] w-full max-w-md mx-auto"
            >
              <div className="absolute inset-0 bg-gray-100 rounded-lg transform rotate-2"></div>
              <div className="absolute inset-0 bg-white shadow-sm border border-gray-200 rounded-lg transform -rotate-1 z-10 overflow-hidden">
                <Image 
                  src="/logo.png" 
                  alt="Murlidhar Studio Logo" 
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-contain p-12 opacity-90"
                />
              </div>
            </motion.div>
          </div>

          <div className="w-full lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-sm font-sans font-medium text-gray-500 tracking-[0.2em] uppercase mb-4">Our Story</h2>
              <h3 className="text-4xl md:text-5xl font-display font-bold text-gray-900 leading-tight mb-6 tracking-tight">
                Crafting Timeless <br/>Visual Narratives
              </h3>
              
              <div className="space-y-6 text-lg text-gray-600 font-sans font-light leading-relaxed">
                <p>
                  At Murlidhar Studio, we believe that every moment holds a unique story waiting to be told. Based in the heart of Kutch, we specialize in high-end wedding photography, cinematic films, and portraiture.
                </p>
                <p>
                  With an editorial approach to storytelling, we blend candid photojournalism with fine-art portraiture to create images that are both authentic and timelessly beautiful.
                </p>
              </div>

              <div className="mt-10">
                <Link 
                  href="/contactus"
                  className="inline-block border-b-2 border-gray-900 pb-1 text-gray-900 font-sans font-semibold tracking-wide uppercase text-sm hover:text-gray-500 hover:border-gray-500 transition-colors"
                >
                  Book a Consultation
                </Link>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
