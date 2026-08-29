import React from "react";
import VideoGallery from "../components/VideoGallery";
import { useVideoData } from "../hooks/useVideoData.js";
import CatBg from "../components/CatBg";
import { categoryData } from "../components/categoryData.jsx";
import SEO from "../components/SEO.jsx";

const CinematicVideos = () => {
  const { videos, loading, error } = useVideoData("cinvideos");
  const data = categoryData.cinvideos;
  return (
    <>
      <SEO 
        title="Cinematic Videos in Kutch | Wedding Cinematography | Murlidhar Studio"
        description="Professional cinematic videography in Kutch. Create stunning wedding films and cinematic videos that tell your story with artistic flair and emotional depth."
        keywords="cinematic videos Kutch, wedding cinematography, wedding films, cinematic videographer, wedding videography, film production"
        url="/cinvideos"
      />
      <CatBg data={data}/>


      <section className="min-h-[60svh] ">
        <VideoGallery videos={videos} loading={loading} error={error} />
      </section>

    </>
  );
};

export default CinematicVideos;