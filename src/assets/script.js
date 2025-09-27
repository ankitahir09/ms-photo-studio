import { useEffect } from "react";

function Slideshow() {
  useEffect(() => {
    console.log("loaded");

    const slides = document.querySelectorAll(".slideshow #slideshowimg");
    const ctrlButtons = document.querySelectorAll(".ctrlbtn");

    let slideIndex = 0;
    let timer;

    function showSlide(index) {
      slides.forEach((slide) => {
        slide.classList.remove("active");
      });
      slides[index].classList.add("active");
      ctrlButtons.forEach((btn, i) => {
        btn.style.backgroundColor =
          i === index ? "black" : "rgb(227, 227, 227)";
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

    function startSlideshow() {
      timer = setInterval(nextSlide, 3000);
    }

    function stopSlideshow() {
      clearInterval(timer);
    }

    showSlide(slideIndex);
    startSlideshow();

    // Define handlers outside the loop so they can be removed
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

    return () => {
      stopSlideshow();
      ctrlButtons.forEach((btn, i) => {
        btn.removeEventListener("click", clickHandlers[i]);
        btn.removeEventListener("touchstart", touchHandlers[i]);
      });
    };
  }, []);

  return null;
}

export default Slideshow;