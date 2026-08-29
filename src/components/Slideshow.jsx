import React, { useEffect, useState, useRef } from "react";
import { getApiBaseUrl } from "../utils/apiBase";
import "./styling/slideshow.css";

function Slideshow() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const slideshowRef = useRef(null);

useEffect(() => {
  const fetchWithRetry = async (url, options, retries = 2, delay = 1000) => {
    try {
      const res = await fetch(url, options);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res;
    } catch (err) {
      if (retries > 0) {
        await new Promise((res) => setTimeout(res, delay));
        return fetchWithRetry(url, options, retries - 1, delay);
      } else {
        throw err;
      }
    }
  };

  const fetchImages = async () => {
    setLoading(true);
    setError(null);
    try {
      const base = getApiBaseUrl();
      const res = await fetchWithRetry(`${base}/api/images?category=homeBg`, {
        headers: { Accept: "application/json" },
        credentials: "omit",
      });
      
      const data = await res.json();

      const imageArray = Array.isArray(data)
        ? data
        : data?.images || data?.data || [];
      setImages(imageArray);
    } catch (err) {
      console.error("Failed to load background images:", err);
      setError(err.message || "Unknown error");
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  fetchImages();
}, []);


  useEffect(() => {
    if (images.length === 0) return;

    const slides = slideshowRef.current.querySelectorAll("#slideshowimg");
    const ctrlButtons = slideshowRef.current.querySelectorAll(".ctrlbtn");

    let slideIndex = 0;
    let timer;

    function showSlide(index) {
      slides.forEach((slide) => slide.classList.remove("active"));
      if (slides[index]) slides[index].classList.add("active");

      ctrlButtons.forEach((btn, i) => {
        btn.style.backgroundColor = i === index ? "black" : "#E3E3E3";
      });
    }

    function nextSlide() {
      slideIndex = (slideIndex + 1) % slides.length;
      showSlide(slideIndex);
      resetTimer();
    }

    function resetTimer() {
      clearInterval(timer);
      timer = setInterval(nextSlide, 3000);
    }

    const clickHandlers = [];
    const touchHandlers = [];

    ctrlButtons.forEach((btn, i) => {
      const clickHandler = () => {
        slideIndex = i;
        showSlide(slideIndex);
        resetTimer();
      };
      const touchHandler = (e) => {
        e.preventDefault();
        slideIndex = i;
        showSlide(slideIndex);
        resetTimer();
      };
      btn.addEventListener("click", clickHandler);
      btn.addEventListener("touchstart", touchHandler);
      clickHandlers.push(clickHandler);
      touchHandlers.push(touchHandler);
    });

    showSlide(slideIndex);
    timer = setInterval(nextSlide, 3000);

    return () => {
      clearInterval(timer);
      ctrlButtons.forEach((btn, i) => {
        btn.removeEventListener("click", clickHandlers[i]);
        btn.removeEventListener("touchstart", touchHandlers[i]);
      });
    };
  }, [images]);

 // Inside Slideshow component:

if (loading) {
  return (
    <div className="slideshow">
      <div className="skeleton" aria-label="Loading images" />
    </div>
  );
}

  if (error) {
    return <div className="slideshow">Error: {error}</div>;
  }

  if (!images || images.length === 0) {
    return <div className="slideshow">No images available</div>;
  }

  return (
    <div className="slideshow" ref={slideshowRef}>
      {images.map((image, index) => (
        <img
          key={image.public_id || index}
          src={`https://res.cloudinary.com/dkmv3uyvz/image/upload/f_auto,q_auto,w_1500/${image.public_id}`}
          id="slideshowimg"
          alt={`Professional photography by Murlidhar Studio - Slide ${index + 1}`}
        />
      ))}
      <div className="controls" role="tablist" aria-label="Slideshow navigation">
        {images.map((_, index) => (
          <button
            className="ctrlbtn"
            key={index}
            role="tab"
            aria-label={`Go to slide ${index + 1}`}
            aria-selected={index === 0}
            tabIndex={index === 0 ? 0 : -1}
          ></button>
        ))}
      </div>
    </div>
  );
}

export default Slideshow;
