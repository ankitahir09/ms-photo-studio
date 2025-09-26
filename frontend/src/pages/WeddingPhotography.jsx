import React, { useEffect, useState } from "react";
import Gallery from "../components/Gallery";
import {usePhotoData} from "../hooks/usePhotoData.js";
import CatBg from "../components/CatBg";
import { categoryData } from "../components/categoryData.jsx";
import SEO from "../components/SEO.jsx";

const WeddingPhotography = () => {
  const { photos, loading, error } = usePhotoData("weddingphotos");
  const data = categoryData.wedding;
  return (
    <>
      <SEO 
        title="Wedding Photography in Kutch | Best Wedding Photographer | Murlidhar Studio"
        description="Professional wedding photography services in Kutch. Capture your special day with our expert wedding photographers. Beautiful, timeless wedding photos that tell your love story."
        keywords="wedding photography Kutch, wedding photographer Gujarat, wedding photos, wedding videography, wedding photographer near me, best wedding photographer"
        url="/weddingphotos"
      />
      <CatBg data={data}/>

      <section className="min-h-[100svh]">
        <Gallery photos={photos} loading={loading} error={error} />
      </section>

  </>
  );
};
export default WeddingPhotography;