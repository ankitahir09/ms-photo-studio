import React from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css/pagination";
import SlideIn from "./Animate";

export const CategoryMenu = ({ slides }) => {
  return (
    <div className="w-full mx-auto flex items-center justify-center relative">
      <SlideIn
        direction="left"
        className="absolute top-[-3.0rem] left-0 px-5 md:px-10"
      >
        <h2 className="text-[#C5A880] text-4xl tracking-wide uppercase font-semibold cormorant mb-8">
          Our Services
        </h2>
      </SlideIn>

      <Swiper
        // install Swiper modules
        modules={[Navigation, Pagination]}
        spaceBetween={20}
        className="px-5 md:px-10 custom-swiper"
        breakpoints={{
          320: { slidesPerView: 1 },
          480: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        pagination={{ clickable: true }}
        onSlideChange={() => console.log("slide change")}
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.image}>
            <div className="relative group overflow-hidden aspect-[3/4] w-full ">
              <img
                className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700 filter group-hover:brightness-80"
                src={slide.image}
                alt={slide.title}
              />

              {/* Gradient Overlay */}
              <div className="opacity-60 group-hover:opacity-100 transition-opacity duration-700 h-[40%] w-full absolute bottom-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>

              {/* Text + Arrow */}
              <div className="absolute -bottom-5 left-0 w-full text-white text-center transition-all duration-700 group-hover:-translate-y-10">
                <div className="nunito-sans text-xl">
                  {slide.title.split(" ").map((word, index) => (
                    <div
                      className={index === 0 ? "lovelight text-3xl -my-3" : ""}
                      key={index}
                    >
                      {word}
                    </div>
                  ))}
                </div>
                {/* Arrow shown on hover */}
                <Link to={slide.type}>
                  <div className="opacity-0 hover:text-[#D4AF37] group-hover:opacity-100 transition-opacity duration-700 text-white text-3xl mt-2">
                    →
                  </div>
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
