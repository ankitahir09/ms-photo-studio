import React, { useState, useEffect } from "react";
import SlideIn from "./Animate";

const CatBg = ({ data }) => {
  const srcMain = `https://res.cloudinary.com/dkmv3uyvz/image/upload/f_auto,q_80,w_800,dpr_auto/${data.src}`;
  const srcBg = `https://res.cloudinary.com/dkmv3uyvz/image/upload/f_auto,q_10,w_100,dpr_auto/${data.src}`;

  const [mainLoaded, setMainLoaded] = useState(false);
  const [bgLoaded, setBgLoaded] = useState(false);
  const [showContent, setShowContent] = useState(false);

  // ✅ Robust retry for broken images
  const handleImgError = (src, setter, maxRetries = 3) => {
    let retries = 0;
    const retryLoad = () => {
      if (retries < maxRetries) {
        retries++;
        const retryImg = new Image();
        retryImg.src = `${src}?retry=${Date.now()}`;
        retryImg.onload = () => setter(true);
        retryImg.onerror = retryLoad;
      }
    };
    retryLoad();
  };

  // ✅ Preload images using Image() constructor (works even when cached)
  useEffect(() => {
    let bgImg = new Image();
    let mainImg = new Image();

    bgImg.src = srcBg;
    mainImg.src = srcMain;

    bgImg.onload = () => setBgLoaded(true);
    mainImg.onload = () => setMainLoaded(true);

    bgImg.onerror = () => handleImgError(srcBg, setBgLoaded);
    mainImg.onerror = () => handleImgError(srcMain, setMainLoaded);

    return () => {
      bgImg.onload = null;
      mainImg.onload = null;
      bgImg.onerror = null;
      mainImg.onerror = null;
    };
  }, [srcMain, srcBg]);

  // ✅ Trigger animation after both loaded
  useEffect(() => {
    if (mainLoaded && bgLoaded) {
      const timeout = setTimeout(() => setShowContent(true), 500);
      return () => clearTimeout(timeout);
    }
  }, [mainLoaded, bgLoaded]);

  // ✅ Safety fallback: prevent infinite spinner
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!mainLoaded || !bgLoaded) {
        console.warn("Image load timeout — forcing content show");
        setMainLoaded(true);
        setBgLoaded(true);
        setShowContent(true);
      }
    }, 7000); // fallback after 7 seconds
    return () => clearTimeout(timeout);
  }, [mainLoaded, bgLoaded]);

  return (
    <section className="md:min-h-[100svh] relative md:flex md:items-center">
      {/* Loading overlay */}
      {!showContent && (
        <div className="absolute inset-0 z-50 flex items-center min-h-svh justify-center bg-black">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Background blur (low quality image) */}
      <div
        className="md:block absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: `url(${srcBg})` }}
      />
      <div className="hidden md:block absolute inset-0 backdrop-blur-lg bg-black/30 z-0" />

      {/* Main Content */}
      {showContent && (
        <div className="relative z-10 w-full md:h-full transition-opacity duration-700">
          <div className="grid grid-cols-1 md:grid-cols-12 w-full max-w-full backdrop-blur-lg overflow-hidden shadow-lg">
            {/* Text Section */}
            <div className="md:col-span-5 bg-white/90 opacity-70 p-6 flex flex-col justify-center text-black">
              <SlideIn direction="left">
                <h3 className="text-2xl md:text-4xl cormorant font-medium">
                  {data.title}
                </h3>
              </SlideIn>
              <SlideIn type="blurIn" duration="1">
                <p className="hidden md:block mt-3 text-sm md:text-base nunito-sans">
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
              />
            </div>

            {/* Description for mobile */}
            <div className="md:hidden bg-white/90 opacity-70 p-6 text-black">
              <SlideIn type="blurIn" duration="1">
                <p className="my-3 text-sm md:text-base nunito-sans">
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
