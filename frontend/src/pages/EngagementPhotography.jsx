import React, { useEffect, useState } from "react";
import Gallery from "../components/Gallery";
import {usePhotoData} from "../hooks/usePhotoData.js";
import CatBg from "../components/CatBg";
import { categoryData } from "../components/categoryData.jsx";
import SEO from "../components/SEO.jsx";

const EngagementPhotography = () => {
  const { photos, loading, error } = usePhotoData("engagephotos");
  const data = categoryData.engagement;
  return (
    <>
      <SEO 
        title="Engagement Photography in Kutch | Engagement Shoot | Murlidhar Studio"
        description="Professional engagement photography in Kutch. Capture your special engagement moments with beautiful, romantic photos that celebrate your love story."
        keywords="engagement photography Kutch, engagement shoot, couple photos, romantic photography, engagement photographer, pre-wedding photos"
        url="/engagephotos"
      />
      <CatBg data={data}/>




      <section className="min-h-[60svh]">
        <Gallery photos={photos} loading={loading} error={error} />
      </section>
    </>
  );
};
export default EngagementPhotography;