import React, { useState, useEffect } from "react";
import SlideIn from "./Animate";

const CatBg = ({ data }) => {
  const srcMain = `https://res.cloudinary.com/dkmv3uyvz/image/upload/f_auto,q_80,w_800,dpr_auto/${data.src}`;
  const srcBg = `https://res.cloudinary.com/dkmv3uyvz/image/upload/f_auto,q_10,w_100,dpr_auto/${data.src}`;

  const [mainLoaded, setMainLoaded] = useState(false);
  const [bgLoaded, setBgLoaded] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [animateTitle, setAnimateTitle] = useState(false);

  // Auto-retry handler for img loading errors
  const handleImgError = (e, src, maxRetries = 4) => {
    if (!e.target._retryCount) e.target._retryCount = 0;
    if (e.target._retryCount < maxRetries) {
      e.target._retryCount += 1;
      setTimeout(() => {
        e.target.src = src + `?retry=${Math.random()}`; // force reload with unique query
      }, 300);
    }
  };

  // Trigger animation after both images are loaded
  useEffect(() => {
    if (mainLoaded && bgLoaded) {
      const timeout = setTimeout(() => {
        setShowContent(true);
        setAnimateTitle(true);
      }, 500); // delay for smoother transition
      return () => clearTimeout(timeout);
    }
  }, [mainLoaded, bgLoaded]);

  return (
    <section className="md:min-h-[100svh] relative md:flex md:items-center">
      {/* Hidden preloaders for tracking */}
      <img
        src={srcBg}
        alt="Background low-quality preview"
        className="hidden"
        onLoad={() => setBgLoaded(true)}
        onError={(e) => handleImgError(e, srcBg)}
      />
      <img
        src={srcMain}
        alt="Main category banner"
        className="hidden"
        onLoad={() => setMainLoaded(true)}
        onError={(e) => handleImgError(e, srcMain)}
      />

      {/* Loading screen */}
      {!showContent && (
        <div className="absolute inset-0 z-50 flex items-center min-h-svh justify-center bg-black">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Background and blur overlays only on md+ */}
      <div
        className="md:block absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: `url(${srcBg})` }}
      />
      <div className="hidden md:block absolute inset-0 backdrop-blur-lg bg-black/30 z-0" />

      {/* Main content always visible */}
      {showContent && (
        <div className="relative z-10 w-full md:h-full transition-opacity duration-700">
          <div className="grid grid-cols-1 md:grid-cols-12 w-full max-w-full backdrop-blur-lg overflow-hidden shadow-lg">
            {/* Text Section */}
            <div className="md:col-span-5 bg-white/90 opacity-70 p-6 flex flex-col justify-center text-black">
              <SlideIn direction="left" className="">
                <h3 className="text-2xl md:text-4xl opacity-100 cormorant font-medium">
                  {data.title}
                </h3>
              </SlideIn>
              <SlideIn type="blurIn" duration="1" className="">
                <p className="hidden md:block mt-3 text-sm md:text-base nunito-sans opacity-100">
                  {data.description}
                </p>
              </SlideIn>
            </div>
            {/* Image Section */}
            <div className="md:col-span-7 w-full h-64 md:h-auto">
              <img
                src={srcMain}
                alt={data.title}
                className="w-full h-full object-cover object-center"
                onError={(e) => handleImgError(e, srcMain)}
              />
            </div>
            <div className="md:hidden md:col-span-5 bg-white/90 opacity-70 p-6 flex flex-col justify-center text-black">
              <SlideIn type="blurIn" duration="1" className="">
                <p className="md:hidden my-3 text-sm md:text-base nunito-sans opacity-100">
                  {data.description}
                </p>
              </SlideIn>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default CatBg;
