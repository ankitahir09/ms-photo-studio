"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";

const ChevronDown = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

const navItems = [
  { name: "Home", href: "/" },
  {
    name: "Photos",
    dropdown: [
      { name: "Pre Wedding", href: "/prewed" },
      { name: "Wedding", href: "/weddingphotos" },
      { name: "Engagement", href: "/engagephotos" },
      { name: "Kids", href: "/kidsphotography" },
      { name: "Maternity", href: "/maternityshoot" },
      { name: "Modelling", href: "/modellingshoot" },
    ],
  },
  {
    name: "Videos",
    dropdown: [{ name: "Cinematography", href: "/cinvideos" }],
  },
  { name: "Contact", href: "/contactus" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileDropdown, setMobileDropdown] = useState(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (href) => pathname === href;
  const isItemActive = (item) => {
    if (item.href) return isActive(item.href);
    if (item.dropdown) return item.dropdown.some((d) => isActive(d.href));
    return false;
  };

  const isHomePage = pathname === "/";
  const isSolid = scrolled || !isHomePage;

  // Apple style floating navbar
  const navBg = isSolid
    ? "bg-white/70 backdrop-blur-xl border border-gray-200/50 shadow-lg"
    : "bg-white/10 backdrop-blur-md border border-white/20 shadow-sm";

  const textColor = isSolid ? "text-gray-900" : "text-white";
  const logoFilter = isSolid ? "invert(1)" : "invert(0)";

  return (
    <>
      <nav
        className={`fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-6xl z-50 transition-all duration-500 rounded-full ${navBg}`}
      >
        <div className="px-6 lg:px-8 flex justify-between items-center h-16">
          <Link
            href="/"
            className="relative z-50 flex items-center gap-2 group"
          >
            <span
              className={`font-display font-bold tracking-widest uppercase text-base hidden sm:block ${textColor}`}
            >
              Murlidhar Studio
            </span>
          </Link>

          {/* Desktop Links */}
          <ul className="hidden lg:flex items-center space-x-2">
            {navItems.map((item) => (
              <li
                key={item.name}
                className="relative group"
                onMouseEnter={() => setActiveDropdown(item.name)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                {item.href ? (
                  <Link
                    href={item.href}
                    className={`relative z-10 py-2 px-4 block rounded-full transition-colors ${textColor} hover:opacity-70`}
                  >
                    <span className="text-sm font-medium tracking-wide">
                      {item.name}
                    </span>
                    {isItemActive(item) && (
                      <motion.div
                        layoutId="activeNavIndicator"
                        className={`absolute inset-0 rounded-full z-[-1] ${isSolid ? "bg-gray-100" : "bg-white/20"}`}
                        initial={false}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                        }}
                      />
                    )}
                  </Link>
                ) : (
                  <div
                    className={`relative z-10 py-2 px-4 block rounded-full cursor-pointer transition-colors ${textColor} hover:opacity-70`}
                  >
                    <span className="text-sm font-medium tracking-wide flex items-center gap-1">
                      {item.name}
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-300 ${activeDropdown === item.name ? "rotate-180" : ""}`}
                      />
                    </span>
                    {isItemActive(item) && (
                      <motion.div
                        layoutId="activeNavIndicator"
                        className={`absolute inset-0 rounded-full z-[-1] ${isSolid ? "bg-gray-100" : "bg-white/20"}`}
                        initial={false}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                        }}
                      />
                    )}
                  </div>
                )}

                {/* Dropdown menu */}
                {item.dropdown && (
                  <AnimatePresence>
                    {activeDropdown === item.name && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-white/90 backdrop-blur-xl border border-gray-200/50 shadow-xl rounded-2xl overflow-hidden py-2 before:absolute before:-top-4 before:left-0 before:w-full before:h-4"
                      >
                        {item.dropdown.map((dropItem) => (
                          <Link
                            key={dropItem.href}
                            href={dropItem.href}
                            className={`block px-4 py-2 text-sm transition-colors ${
                              isActive(dropItem.href)
                                ? "bg-gray-100 text-black font-semibold"
                                : "text-gray-700 hover:bg-gray-50 hover:text-black"
                            }`}
                            onClick={() => setActiveDropdown(null)}
                          >
                            {dropItem.name}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </li>
            ))}
          </ul>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`lg:hidden relative z-50 p-2 focus:outline-none ${isOpen ? "text-gray-900" : textColor}`}
            aria-label="Toggle Menu"
          >
            <motion.div
              animate={isOpen ? "open" : "closed"}
              className="w-6 h-5 flex flex-col justify-between"
            >
              <motion.span
                variants={{
                  closed: { rotate: 0, y: 0 },
                  open: { rotate: 45, y: 8 },
                }}
                className={`w-full h-[2px] block origin-left transition-colors ${isOpen ? "bg-gray-900" : "bg-current"}`}
              />
              <motion.span
                variants={{ closed: { opacity: 1 }, open: { opacity: 0 } }}
                className={`w-full h-[2px] block transition-colors ${isOpen ? "bg-gray-900" : "bg-current"}`}
              />
              <motion.span
                variants={{
                  closed: { rotate: 0, y: 0 },
                  open: { rotate: -45, y: -8 },
                }}
                className={`w-full h-[2px] block origin-left transition-colors ${isOpen ? "bg-gray-900" : "bg-current"}`}
              />
            </motion.div>
          </button>
        </div>
      </nav>

      {/* Mobile Fullscreen Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, clipPath: "circle(0% at 100% 0)" }}
            animate={{ opacity: 1, clipPath: "circle(150% at 100% 0)" }}
            exit={{ opacity: 0, clipPath: "circle(0% at 100% 0)" }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="fixed inset-0 z-40 bg-white/95 backdrop-blur-xl pt-32 px-6 overflow-y-auto"
          >
            <ul className="flex flex-col space-y-6 items-center pb-20">
              {navItems.map((item, i) => (
                <motion.li
                  key={item.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 + 0.1 }}
                  className="w-full text-center"
                >
                  {item.href ? (
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`block py-2 text-2xl font-display font-medium tracking-wide uppercase ${
                        isActive(item.href) ? "text-black" : "text-gray-400"
                      }`}
                    >
                      {item.name}
                    </Link>
                  ) : (
                    <div className="flex flex-col items-center">
                      <button
                        onClick={() =>
                          setMobileDropdown(
                            mobileDropdown === item.name ? null : item.name,
                          )
                        }
                        className={`flex items-center justify-center gap-2 py-2 text-2xl font-display font-medium tracking-wide uppercase transition-colors ${
                          isItemActive(item) ? "text-black" : "text-gray-400"
                        }`}
                      >
                        {item.name}
                        <ChevronDown
                          className={`w-6 h-6 transition-transform duration-300 ${mobileDropdown === item.name ? "rotate-180" : ""}`}
                        />
                      </button>
                      <AnimatePresence>
                        {mobileDropdown === item.name && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden flex flex-col items-center space-y-4 pt-4 pb-2"
                          >
                            {item.dropdown.map((dropItem) => (
                              <Link
                                key={dropItem.href}
                                href={dropItem.href}
                                onClick={() => setIsOpen(false)}
                                className={`block text-lg font-medium transition-colors ${
                                  isActive(dropItem.href)
                                    ? "text-black"
                                    : "text-gray-500 hover:text-black"
                                }`}
                              >
                                {dropItem.name}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
