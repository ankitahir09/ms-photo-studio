"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import AnimateIn from "@/components/ui/AnimateIn";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#111] text-white pt-16 pb-8 border-t border-[var(--color-gold-700)]/20 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('/logof.png')] bg-center bg-no-repeat bg-contain" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
          <AnimateIn direction="bottom" delay={0.1}>
            <div className="flex flex-col items-center md:items-start space-y-4">
              <Link href="/">
                <Image
                  src="/logo-no-bg.png"
                  alt="Murlidhar Studio"
                  width={150}
                  height={150}
                  className="mb-4"
                />
              </Link>
              <p className="text-gray-400 font-nunito max-w-xs">
                Capturing your timeless moments with cinematic elegance and
                premium photography in Kutch.
              </p>
            </div>
          </AnimateIn>

          <AnimateIn direction="bottom" delay={0.2}>
            <div className="space-y-4">
              <h3 className="text-2xl font-cormorant text-[var(--color-gold-500)]">
                Quick Links
              </h3>
              <ul className="space-y-2 font-nunito">
                <li>
                  <Link
                    href="/"
                    className="hover:text-[var(--color-gold-500)] transition-colors"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/weddingphotos"
                    className="hover:text-[var(--color-gold-500)] transition-colors"
                  >
                    Wedding Photography
                  </Link>
                </li>
                <li>
                  <Link
                    href="/cinvideos"
                    className="hover:text-[var(--color-gold-500)] transition-colors"
                  >
                    Cinematic Videos
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contactus"
                    className="hover:text-[var(--color-gold-500)] transition-colors"
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
          </AnimateIn>

          <AnimateIn direction="bottom" delay={0.3}>
            <div className="space-y-4">
              <h3 className="text-2xl font-cormorant text-[var(--color-gold-500)]">
                Connect With Us
              </h3>
              <p className="font-nunito text-gray-400">413/D, Old Lakda Bazar, Laxmi Tokiz to Khatri bazar Road, Nr. Ganga Naka, Anjar, Gujarat 370110</p>
              <p className="font-nunito text-gray-400">
                Phone: +91 9979912805
              </p>
              <p className="font-nunito text-gray-400">
                Email: murlidharstudio28@gmail.com
              </p>

              <div className="flex justify-center md:justify-start space-x-4 pt-4">
                {[
                  {
                    url: "https://www.instagram.com/murlidhar_studio_official/",
                    alt: "Instagram",
                    icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-gold-500)] group-hover:text-white transition-colors">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                      </svg>
                    )
                  },
                  {
                    url: "https://www.facebook.com/profile.php?id=100084757284488&mibextid=ZbWKwL",
                    alt: "Facebook",
                    icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-gold-500)] group-hover:text-white transition-colors">
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                      </svg>
                    )
                  },
                  {
                    url: "https://wa.me/+919979912805",
                    alt: "WhatsApp",
                    icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-gold-500)] group-hover:text-white transition-colors">
                        <path d="M3 21l1.65 -3.8a9 9 0 1 1 3.4 2.9l-5.05 .9"></path>
                        <path d="M9 10a.5 .5 0 0 0 1 0v-1a.5 .5 0 0 0 -1 0v1a5 5 0 0 0 5 5h1a.5 .5 0 0 0 0 -1h-1a.5 .5 0 0 0 0 1"></path>
                      </svg>
                    )
                  },
                ].map((social) => (
                  <motion.a
                    key={social.alt}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    className="group w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[var(--color-gold-600)]/80 border border-white/10 hover:border-[var(--color-gold-500)] transition-colors"
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </div>
          </AnimateIn>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 pt-8 border-t border-white/10 text-center font-nunito text-sm text-gray-500"
        >
          <p>&copy; {currentYear} Murlidhar Studio. All rights reserved.</p>
        </motion.div>
      </div>
    </footer>
  );
}
