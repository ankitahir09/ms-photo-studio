import React, {useEffect, useState,useRef } from "react";
import "./styling/slideshow.css";

function Slideshow() {
  const [images, setImages] = useState([]);
  const slideshowRef = useRef(null);
  
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch(`/api/images/homeBg`);
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        console.log('API Response:', data); // Debug log
        
        // Ensure data is an array
        const imageArray = Array.isArray(data) ? data : (data?.images || data?.data || []);
        console.log('Processed images array:', imageArray); // Debug log
        setImages(imageArray);
      } catch (err) {
        console.error("Failed to load background images:", err);
        setImages([]); // Set empty array on error
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

  // Don't render if no images
  if (!images || images.length === 0) {
    return <div className="slideshow">No images available</div>;
  }

  return (
    <div className="slideshow" ref={slideshowRef}>
      {images.map((image, index) => (
        <img key={image.public_id || index} src={image.url} id="slideshowimg" alt={`Professional photography by Murlidhar Studio - Slide ${index + 1}`} />
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
