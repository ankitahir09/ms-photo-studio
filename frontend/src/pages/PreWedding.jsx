import React, { useEffect, useState } from "react";
import Gallery from "../components/Gallery";
import CatBg from "../components/CatBg";
import {usePhotoData} from "../hooks/usePhotoData.js";
import { categoryData } from "../components/categoryData.jsx";
import SEO from "../components/SEO.jsx";

const PreWedding = () => {
const { photos, loading, error } = usePhotoData("prewedphotos");
const data = categoryData.prewedshoot;
  return (
    <>
      <SEO 
        title="Pre-Wedding Photography in Kutch | Pre-Wedding Shoot | Murlidhar Studio"
        description="Beautiful pre-wedding photography sessions in Kutch. Professional pre-wedding shoots that capture your love story with artistic flair and romantic settings."
        keywords="pre-wedding photography Kutch, pre-wedding shoot, engagement photos, couple photography, romantic photography, pre-wedding photographer"
        url="/prewed"
      />
      <CatBg data={data}/>
        
      <section className="min-h-[100svh]">
        <Gallery photos={photos} loading={loading} error={error} />
      </section>

    </>
  );
};

export default PreWedding;