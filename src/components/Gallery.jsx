import React, { useState, useEffect, useCallback, useRef } from "react";
import Masonry from "react-masonry-css";
import arrowLeft from "../assets/arrow-left-svgrepo-com.svg";
import arrowRight from "../assets/arrow-right-svgrepo-com.svg";
import plusCircle from "../assets/plus-circle.svg";
import minusCircle from "../assets/minus-circle.svg";

const Gallery = ({ photos, loading, error }) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [loadedImages, setLoadedImages] = useState(new Set());
  const [imageErrors, setImageErrors] = useState(new Set());
  const [preloadedImages, setPreloadedImages] = useState(new Set());
  const [visibleImages, setVisibleImages] = useState(new Set());
  const observerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(null);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    if (isPreviewOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isPreviewOpen]);

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.dataset.index);
            setVisibleImages((prev) => new Set([...prev, index]));
            observer.unobserve(entry.target); // unobserve after visible for performance
          }
        });
      },
      {
        rootMargin: "100px",
        threshold: 0.1,
      }
    );

    observerRef.current = observer;
    return () => observer.disconnect();
  }, []);

  const handleImageLoad = useCallback((publicId) => {
    setLoadedImages((prev) => new Set([...prev, publicId]));
  }, []);

  const handleImageError = useCallback((publicId, retryCount = 0) => {
    if (retryCount < 3) {
      const img = new Image();
      const retryUrl = `https://res.cloudinary.com/dkmv3uyvz/image/upload/f_auto,q_auto,c_fill,w_1200/${publicId}?retry=${Date.now()}`;
      img.src = retryUrl;
      img.onload = () => {
        // If retry succeeds, mark as loaded and remove from error set
        setLoadedImages((prev) => new Set([...prev, publicId]));
        setImageErrors((prev) => {
          const updated = new Set(prev);
          updated.delete(publicId);
          return updated;
        });
      };
      img.onerror = () => {
        setTimeout(() => handleImageError(publicId, retryCount + 1), 400);
      };
    } else {
      setImageErrors((prev) => new Set([...prev, publicId]));
    }
  }, []);

  // Preload adjacent images for faster navigation
  const preloadAdjacentImages = useCallback(
    (currentIndex) => {
      if (!photos || photos.length === 0) return;

      const preloadIndexes = [
        currentIndex - 1,
        currentIndex + 1,
        currentIndex - 2,
        currentIndex + 2,
      ].filter((index) => index >= 0 && index < photos.length);

      preloadIndexes.forEach((index) => {
        const photo = photos[index];
        if (photo && !preloadedImages.has(photo.public_id)) {
          const img = new Image();
          img.onload = () => {
            setPreloadedImages((prev) => new Set([...prev, photo.public_id]));
          };
          img.src =
            photo.url ||
            `https://res.cloudinary.com/dkmv3uyvz/image/upload/f_webp,q_80,c_fill,w_1200/${photo.public_id}`;
        }
      });
    },
    [photos, preloadedImages]
  );

  // Masonry breakpoint config
  const breakpointColumnsObj = {
    default: 3,
    1024: 2,
    600: 1,
  };

  const openModal = (index) => {
    setActiveIndex(index);
    setZoom(1); // reset zoom on open
    preloadAdjacentImages(index);
    setIsPreviewOpen(true);
  };

  const closeModal = () => {
    setActiveIndex(null);
    setIsPreviewOpen(false);
  };

  const prevImage = () => {
    setActiveIndex((prev) => {
      const newIndex = prev > 0 ? prev - 1 : prev;
      if (newIndex !== prev) preloadAdjacentImages(newIndex);
      return newIndex;
    });
  };

  const nextImage = () => {
    setActiveIndex((prev) => {
      const newIndex = prev < photos.length - 1 ? prev + 1 : prev;
      if (newIndex !== prev) preloadAdjacentImages(newIndex);
      return newIndex;
    });
  };

  const zoomIn = () => setZoom((z) => Math.min(z + 0.25, 3));
  const zoomOut = () => setZoom((z) => Math.max(z - 0.25, 0.5));

  if (loading) {
    return (
      <div className="min-h-[100svh] flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading photos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[100svh] flex items-center justify-center">
        <div className="text-center p-8 max-w-md">
          <div className="text-red-500 text-xl mb-4">
            ⚠️ Error Loading Photos
          </div>
          <div className="text-gray-600 mb-4">{error}</div>
          <div className="text-sm text-gray-500">
            <p>This might be because:</p>
            <ul className="list-disc list-inside mt-2 text-left">
              <li>Backend server is not running</li>
              <li>Database connection issues</li>
              <li>Missing environment variables</li>
            </ul>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!photos || photos.length === 0) {
    return (
      <div className="min-h-[100svh] flex items-center justify-center text-3xl text-gray-500">
        Update Soon!
      </div>
    );
  }

  return (
    <>
      <div className="py-4">
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="flex gap-4 px-4"
          columnClassName="space-y-4"
        >
          {photos.map((photo, index) => {
            const optimizedUrl =
              photo.url ||
              `https://res.cloudinary.com/dkmv3uyvz/image/upload/f_auto,q_auto,w_1200/${photo.public_id}`;
            const isLoaded = loadedImages.has(photo.public_id);
            const hasError = imageErrors.has(photo.public_id);
            const isVisible = visibleImages.has(index);

            return (
              <div
                key={photo.public_id}
                className="break-inside-avoid overflow-hidden shadow-sm cursor-pointer relative"
                onClick={() => openModal(index)}
                data-index={index}
                ref={(el) => {
                  if (el && observerRef.current) {
                    observerRef.current.observe(el);
                  }
                }}
              >
                {!isLoaded && !hasError && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                    <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                  </div>
                )}
                {hasError && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-200 text-gray-500">
                    <p>Failed to load</p>
                  </div>
                )}
                {isVisible ? (
                  <img
                    src={optimizedUrl}
                    alt={
                      photo.title ||
                      `Professional photography by Murlidhar Studio - Image ${
                        index + 1
                      }`
                    }
                    className={`w-full h-auto object-cover transition-all duration-300 hover:scale-105 ${
                      isLoaded ? "opacity-100" : "opacity-0"
                    }`}
                    decoding="async"
                    fetchpriority="high"
                    onLoad={() => handleImageLoad(photo.public_id)}
                    onError={() => handleImageError(photo.public_id)}
                  />
                ) : (
                  <div className="w-full h-64 bg-gray-200 animate-pulse"></div>
                )}
              </div>
            );
          })}
        </Masonry>
      </div>
      {/* Lightbox Modal */}
      {activeIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center">
          <button
            onClick={closeModal}
            className="absolute z-50 top-4 right-4 text-white text-3xl font-bold"
            aria-label="Close preview"
          >
            &times;
          </button>

          <button
            onClick={prevImage}
            disabled={activeIndex === 0}
            className="absolute left-4 z-50 text-white text-4xl font-bold font-sans leading-none"
            aria-label="Previous image"
          >
            <img src={arrowLeft} className="w-10 h-10" alt="Previous" />
          </button>

          <div className="max-w-full max-h-full p-4">
            <img
              src={photos[activeIndex].url}
              alt={
                photos[activeIndex].title ||
                `Professional photography by Murlidhar Studio - Image ${
                  activeIndex + 1
                }`
              }
              className="max-h-[80svh] max-w-[90vw] mx-auto"
              style={{
                transform: `scale(${zoom})`,
                transition: "transform 0.3s",
              }}
              onLoad={() => {
                setPreloadedImages(
                  (prev) => new Set([...prev, photos[activeIndex].public_id])
                );
              }}
            />
          </div>

          <button
            onClick={nextImage}
            disabled={activeIndex === photos.length - 1}
            className="absolute right-4 z-50 text-white text-4xl font-bold font-sans leading-none"
            aria-label="Next image"
          >
            <img src={arrowRight} className="w-10 h-10" alt="Next" />
          </button>

          {/* Zoom Controls */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-4">
            <button
              onClick={zoomOut}
              className="w-9 h-9 flex items-center justify-center bg-white/20 text-white rounded-full"
              aria-label="Zoom Out"
            >
              <img src={minusCircle} alt="Zoom out" />
            </button>

            <button
              onClick={zoomIn}
              className="w-9 h-9 flex items-center justify-center bg-white/20 text-white rounded-full"
              aria-label="Zoom In"
            >
              <img src={plusCircle} alt="Zoom in" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Gallery;
