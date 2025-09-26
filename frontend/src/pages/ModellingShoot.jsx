import React, { useEffect, useState } from "react";
import Gallery from "../components/Gallery";
import {usePhotoData} from "../hooks/usePhotoData.js";
import CatBg from "../components/CatBg";
import { categoryData } from "../components/categoryData.jsx";
import SEO from "../components/SEO.jsx";

const Modelling = () => {
  const { photos, loading, error } = usePhotoData("modellingshoot");
  const data = categoryData.modelling;
  return (
    <>
      <SEO 
        title="Modelling Photography in Kutch | Professional Model Shoot | Murlidhar Studio"
        description="Professional modelling photography in Kutch. High-quality model shoots, fashion photography, and portfolio photography for models and aspiring talents."
        keywords="modelling photography Kutch, model shoot, fashion photography, portfolio photography, professional model photographer, fashion shoot"
        url="/modellingshoot"
      />
      <CatBg data={data}/>

      <section className="min-h-[100svh] ">
        <Gallery photos={photos} loading={loading} error={error} />
      </section>
    </>
  );
};
export default Modelling;