import React, { useEffect, useState } from "react";
import Gallery from "../components/Gallery";
import {usePhotoData} from "../hooks/usePhotoData.js";
import CatBg from "../components/CatBg";
import { categoryData } from "../components/categoryData.jsx";
import SEO from "../components/SEO.jsx";

const PreWedVideos = () => {
 const { photos, loading, error } = usePhotoData("prewedvideos");
  const data = categoryData.prewedvideos;
  return (
    <>
      <SEO 
        title="Pre-Wedding Videos in Kutch | Pre-Wedding Videography | Murlidhar Studio"
        description="Professional pre-wedding videography in Kutch. Create beautiful cinematic pre-wedding videos that capture your love story with romantic and artistic flair."
        keywords="pre-wedding videos Kutch, pre-wedding videography, couple videos, romantic videos, pre-wedding cinematography, engagement videos"
        url="/prewedvideos"
      />
      <CatBg data={data}/>

      <section className="min-h-[100svh] ">
      <Gallery photos={photos} loading={loading} error={error} />
      </section>
    </>
  );
};

export default PreWedVideos;