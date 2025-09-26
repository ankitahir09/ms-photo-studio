import React from "react";
import Slideshow from "../components/Slideshow.jsx";
import { CategoryMenu } from "../components/CategoryMenu.jsx";
import imageData from "../assets/imgs.json";
import SEO from "../components/SEO.jsx";
import "../App.css";

function Home() {
  return (
    <>
      <SEO 
        title="Murlidhar Studio - Best Wedding Photographer in Kutch | Professional Photography & Videography"
        description="Professional wedding photography, pre-wedding shoots, engagement photography, child photography, maternity shoots, and cinematic videos in Kutch. Trust Murlidhar Studio for your special moments."
        keywords="wedding photographer Kutch, pre-wedding photography, engagement photography, child photography, maternity shoot, cinematic videos, professional photographer Gujarat, wedding videography"
        url="/"
      />
      <section className="h-[100svh]" aria-label="Hero slideshow">
        <Slideshow />
      </section>
      <section className="min-h-[100svh] flex items-center justify-center pt-8" aria-label="Service categories">
        <CategoryMenu slides={imageData.slides} />
      </section>

      <article className="min-h-[100svh] overflow-y-auto px-5 md:px-6 py-12 text-[#1C1C1C]">
        <h1 className="abril-fatface-regular text-2xl md:text-4xl mb-8">
          The Best Wedding Photographer in Kutch — Murlidhar Studio
        </h1>

        <div className="taviraj-regular-italic leading-normal tracking-normal text-base md:text-lg space-y-10 text-justify">
          <section>
            <h2 className="monda text-xl text-[#B8860B] mb-2">
              Wedding Photography
            </h2>
            <p>
              Weddings are magical. Our photographers capture every emotion and
              detail. Trust the{" "}
              <a href="weddingphotos" className="underline text-[#B8860B]">
                best Wedding Photographer in Kutch
              </a>{" "}
              to eternalize your day.
            </p>
          </section>

          <section>
            <h2 className="monda text-xl text-[#B8860B] mb-2">
              Pre-Wedding Photography
            </h2>
            <p>
              Pre-wedding shoots reflect your love story before the vows.{" "}
              <a href="/prewedphotos" className="underline text-[#B8860B]">
                Pre-wedding Photography in Kutch
              </a>{" "}
              blends emotions with cinematic artistry.
            </p>
          </section>
          <section>
            <h2 className="monda text-xl text-[#B8860B] mb-2">
              Maternity Photography
            </h2>
            <p>
              This special phase of life is a celebration of love, hope, and new
              beginnings.{" "}
              <a href="/maternityshoot" className="underline text-[#B8860B]">
                Maternity Photography in Kutch
              </a>{" "}
              captures motherhood’s strength and softness with grace and
              sensitivity.
            </p>
          </section>  
          <section>
            <h2 className="monda text-xl text-[#B8860B] mb-2">
              Child Photography
            </h2>
            <p>
              Children grow up quickly, and preserving their early years is
              something every parent treasures.{" "}
              <a href="/kidsphotography" className="underline text-[#B8860B]">
                Child Photography in Kutch
              </a>{" "}
              captures unfiltered joy and innocence. Our experts naturally
              engage children — turning moments into memories.
            </p>
          </section>

          <section>
            <h2 className="monda text-xl text-[#B8860B] mb-2">
              Pre-Wedding Videography
            </h2>
            <p>
              Storytelling in motion —{" "}
              <a href="prewedvideos" className="underline text-[#B8860B]">
                Pre-wedding Videography
              </a>{" "}
              turns your bond into a cinematic masterpiece.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl martel-black mt-10 mb-4">
              Murlidhar Studio — A Legacy of Excellence
            </h2>
            <p>
              Based in Kutch, our legacy is built on creativity, precision, and
              dedication. From local ceremonies to grand celebrations — we’ve
              captured it all.
            </p>
            <p>
              Our style blends elegance with storytelling. We deliver not just
              photos, but memories that speak.
            </p>
          </section>

          <section>
            <p>
              From consultation to delivery, Murlidhar Studio is committed to
              quality, creativity, and satisfaction. We don't just click — we
              craft timeless visual stories.
            </p>
          </section>
        </div>
      </article>
    </>
  );
}

export default Home;
