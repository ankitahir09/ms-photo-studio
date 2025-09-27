import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import menuIcon from "../assets/menu.svg";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  useEffect(() => {
      if (isPreviewOpen) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "auto";
      }
    }, [isPreviewOpen]);

  return (
    <>
      {/* MOBILE MENU BUTTON */}
<div className="flex justify-between items-center lg:hidden fixed top-0 z-20 bg-white w-full min-h-11 px-4 shadow-sm">
  {/* Menu Button */}
  <button
    className="text-black hover:bg-gray-100"
    onClick={() => { 
      setIsOpen(true);
      setIsPreviewOpen(true);
     }}
    aria-label="Open menu"
  >
    <img src={menuIcon} alt="" className="h-6 w-6" /> 
  </button>

  {/* Navigation Links */}
  <div className="flex gap-4 text-lg items-center font-normal cormorant">
    <a href="/" className="hover:text-gray-600 transition">Home</a>
    <a href="/contactus" className="hover:text-gray-600 transition">Contact Us</a>
  </div>
</div>

      {/* SIDEBAR MENU */}
      <div
        className={`flex w-screen overflow-hidden flex-col items-center justify-center fixed top-0 left-0 min-h-full bg-[#000] text-white z-30 transition-transform duration-300 
    ${
      isOpen ? "translate-x-0" : "-translate-x-full"
    } lg:translate-x-0 lg:w-25p`}
      >
        {/* CLOSE BUTTON FOR MOBILE */}
        <button
          className="lg:hidden z-40 absolute top-4 right-4 text-white"
          onClick={() =>{ 
            setIsOpen(false);
            setIsPreviewOpen(false);
          }}
        >
          ✕
        </button>
        <div className="absolute z-20 top-0 mx-auto pt-10">
          <Link to="/">
            <img
              onClick={() => setIsOpen(false)}
              className="w-52"
              src={
                "https://res.cloudinary.com/dkmv3uyvz/image/upload/v1752823360/logo_oc6jfs.png"
              }
              alt="Murlidhar Studio"
            />
          </Link>
        </div>
        {/* NAVIGATION LINKS */}
        <nav className="py-6 px-2 space-y-4 z-30">
          <ul
            onClick={() => setIsOpen(false)}
            className="flex flex-col items-center justify-center text-center space-y-2 uppercase leading-normal tracking-wide nunito-sans text-white text-md"
          >
            <li>
              <Link
                to="/prewed"
                className="block pt-1 md:px-4 px-2 hover:text-[#C5A880] transition duration-200"
              >
                Pre-Wedding Shoot
              </Link>
            </li>
            <li>
              <Link
                to="/weddingphotos"
                className="block pt-1 md:px-4 px-2 hover:text-[#C5A880] transition duration-200"
              >
                Wedding Photography
              </Link>
            </li>
            <li>
              <Link
                to="/engagephotos"
                className="block pt-1 md:px-4 px-2 hover:text-[#C5A880] transition duration-200"
              >
                Engagement Photography
              </Link>
            </li>
            <li>
              <Link
                to="/kidsphotography"
                className="block pt-1 md:px-4 px-2 hover:text-[#C5A880] transition duration-200"
              >
                Kids Photography
              </Link>
            </li>
            <li>
              <Link
                to="/maternityshoot"
                className="block pt-1 md:px-4 px-2 hover:text-[#C5A880] transition duration-200"
              >
                Maternity Shoot
              </Link>
            </li>
            <li>
              <Link
                to="/kidvideos"
                className="block pt-1 md:px-4 px-2 hover:text-[#C5A880] transition duration-200"
              >
                Kids Videos
              </Link>
            </li>
            <li>
              <Link
                to="/cinvideos"
                className="block pt-1 md:px-4 px-2 hover:text-[#C5A880] transition duration-200"
              >
                Cinematic Videos
              </Link>
            </li>
            <li>
              <Link
                to="/prewedvideos"
                className="block pt-1 md:px-4 px-2 hover:text-[#C5A880] transition duration-200"
              >
                Pre-Wedding Videos
              </Link>
            </li>
            <li>
              <Link
                to="/modellingshoot"
                className="block pt-1 md:px-4 px-2 hover:text-[#C5A880] transition duration-200"
              >
                Modelling Shoot
              </Link>
            </li>
          </ul>
        </nav>

        <div className="text-[#C5A880] text-center uppercase absolute bottom-8 cormorant flex flex-col items-center z-20">
          <hr className="h-[2px] bg-[#C5A880] w-[50%] mb-4 border-0" />
          <ul className="space-y-2" onClick={() => setIsOpen(false)}>
            <li>
              <Link to="workwithus" className="hover:text-[#B8860B] cursor-pointer transition">
              WORK WITH US
              </Link>
            </li>
            <li>
              <Link to="contactus" className="hover:text-[#B8860B] cursor-pointer transition">
              CONTACT
              </Link>
            </li>
            <li>
              <Link to="/" className="hover:text-[#B8860B] transition">
                HOME
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Navbar;
