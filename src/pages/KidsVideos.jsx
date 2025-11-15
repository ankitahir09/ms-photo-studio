import React from "react";
import VideoGallery from "../components/VideoGallery";
import { useVideoData } from "../hooks/useVideoData.js";
import CatBg from "../components/CatBg";
import { categoryData } from "../components/categoryData.jsx";
import SEO from "../components/SEO.jsx";

const KidsVideos = () => {
  const { videos, loading, error } = useVideoData("kidvideos");
  const data = categoryData.kidvideos;
  return (
    <>
      <SEO 
        title="Kids Videos in Kutch | Children Videography | Murlidhar Studio"
        description="Professional kids videography in Kutch. Create beautiful video memories of your children with our expert videography services for birthdays, events, and special moments."
        keywords="kids videos Kutch, children videography, kids videographer, birthday videos, children photographer, family videos"
        url="/kidvideos"
      />
      <CatBg data={data}/>

      <section className="min-h-[100svh] ">
        <VideoGallery videos={videos} loading={loading} error={error} />
      </section>

    </>
  );
};
export default KidsVideos;