import React, { useEffect, useState } from "react";
import Gallery from "../components/Gallery";
import {usePhotoData} from "../hooks/usePhotoData.js";
import CatBg from "../components/CatBg";
import { categoryData } from "../components/categoryData.jsx";
import SEO from "../components/SEO.jsx";

const MaternityShoot = () => {
  const { photos, loading, error } = usePhotoData("maternityshoot");
  const data = categoryData.maternity;
  return (
    <>
      <SEO 
        title="Maternity Photography in Kutch | Maternity Shoot | Murlidhar Studio"
        description="Beautiful maternity photography in Kutch. Professional maternity shoots that capture the beauty and joy of pregnancy with artistic and elegant photos."
        keywords="maternity photography Kutch, maternity shoot, pregnancy photos, maternity photographer, baby bump photos, maternity session"
        url="/maternityshoot"
      />
      <CatBg data={data}/>

      <section className="min-h-[100svh] ">
        <Gallery photos={photos} loading={loading} error={error} />
      </section>
    </>
  );
};
export default MaternityShoot;