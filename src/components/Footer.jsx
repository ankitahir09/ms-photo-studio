import React from "react";
import SlideIn from "./Animate";

function Footer() {
  return (
    <div className="md:min-h-[50svh] min-h-[70svh] bg-[#000] text-gray-300 py-4 px-4 flex flex-col items-center justify-center">
      <footer className="w-full max-w-7xl md:px-6 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Studio Name & Social Media */}
          <SlideIn viewport={{once:false, amount:0.2}} direction="left">
            <h2 className="text-2xl font-semibold mb-4 text-white tracking-wide">
              <a href="#" className="text-[#c08e47] transition-colors duration-200">Murlidhar Studio</a>
            </h2>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/profile.php?id=100084757284488&mibextid=ZbWKwL" target="_blank" rel="noopener noreferrer">
                <img src="https://res.cloudinary.com/dkmv3uyvz/image/upload/v1752823356/fb_astrrw.svg" alt="Facebook" className="hover:brightness-125 transition duration-200 h-6 w-6" />
              </a>
              <a href="https://www.instagram.com/murlidhar_studio_official/" target="_blank" rel="noopener noreferrer">
                <img src="https://res.cloudinary.com/dkmv3uyvz/image/upload/v1752823356/ig_gte8zl.svg" alt="Instagram" className="hover:brightness-125 transition duration-200 h-6 w-6" />
              </a>
              <a href="https://wa.me/+919979912805" target="_blank" rel="noopener noreferrer">
                <img src="https://res.cloudinary.com/dkmv3uyvz/image/upload/v1752823358/wa_aw6thz.svg" alt="WhatsApp" className="hover:brightness-125 transition duration-200 h-6 w-6" />
              </a>
            </div>
           </SlideIn>

          {/* Contact Info */}
           <SlideIn viewport={{once:false, amount:0.2}} direction="left" customX={-150}>
            <h6 className="text-base md:text-lg mb-1 text-white">PHONE</h6>
            <p className="text-[14px] roboto mb-3 text-[#a3a3a3]">+91 9979912805</p>
            <h6 className="text-base md:text-lg mb-1 text-white">WRITE</h6>
            <p className="text-base text-[#a3a3a3] roboto">murlidharstudio28@gmail.com</p>
          </SlideIn>

          {/* Address */}
           <SlideIn viewport={{once:false, amount:0.2}} direction="left" customX={-250}>
            <h6 className="text-base md:text-lg mb-1 text-white">ADDRESS</h6>
            <p className="text-[#a3a3a3] roboto">
              413/D, Laxmi Tokiz,<br />
              Khatri bazar, Ganga Naka, Anjar, Gujarat<br />
              370110
            </p>
             <div className="!text-sm text-[#b1b1b1] opacity-80 cormorant select-none mt-8">
          &copy; {new Date().getFullYear()} All rights reserved.
        </div>
          </SlideIn>
        </div>
      </footer>
    </div>
  );
}

export default Footer;
