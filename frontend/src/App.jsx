// src/App.jsx
import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import "./App.css";
import LogoLoader from "./components/LogoLoader";
import ScrollToTop from "./components/ScrollToTop";
import Navbar from "./components/Navbar";
import AdminPage from "./pages/AdminPage";
import UploadPage from "./pages/UploadPage";
import Home from "./pages/Home";
import PreWedding from "./pages/PreWedding";
import WeddingPhotography from "./pages/WeddingPhotography";
import EngagementPhotography from "./pages/EngagementPhotography";
import KidsPhotography from "./pages/ChildPhotography";
import MaternityShoot from "./pages/MaternityShoot";
import KidsVideos from "./pages/KidsVideos";
import Footer from "./components/Footer";
import CinematicVideos from "./pages/CinematicVideos";
import PreWedVideos from "./pages/PreWedVideos";
import ContactUs from "./components/ContactUs"; 
import WorkWithUs from "./components/WorkWithUs";
import { AnimatePresence, motion } from "framer-motion";
import Modelling from "./pages/ModellingShoot";
import NotFound from "./pages/NotFound";

function App() {
  const location = useLocation();
  const [showLoader, setShowLoader] = useState(location.pathname === "/");

  useEffect(() => {
  if (location.pathname === "/") {
    document.body.style.overflow = "hidden"; // Set BEFORE showing loader
    setShowLoader(true);
    const timer = setTimeout(() => {
      setShowLoader(false);
      document.body.style.overflow = "auto"; // Restore after loader
    }, 1500);
    return () => clearTimeout(timer);
  } else {
    setShowLoader(false);
    document.body.style.overflow = "auto"; // Always restore for other pages
  }
}, [location.pathname]);


  const isAdminRoute =
    location.pathname === "/admin" || location.pathname === "/upload";
  return !isAdminRoute ? (
    <>
      <AnimatePresence>
        {showLoader && <LogoLoader />}
      </AnimatePresence>

      {!showLoader && (
        <>
      <ScrollToTop />
        <Navbar />
      {/* Main content area */}
      <main className="flex-1 lg:ml-25p lg:w-75p w-full mt-11 lg:mt-0" role="main">
           
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/prewed" element={<PreWedding />} />
          <Route path="/weddingphotos" element={<WeddingPhotography />} />
          <Route path="/engagephotos" element={<EngagementPhotography />} />
          <Route path="/kidsphotography" element={<KidsPhotography />} />
          <Route path="/maternityshoot" element={<MaternityShoot />} />
          <Route path="/kidvideos" element={<KidsVideos />} />
          <Route path="/cinvideos" element={<CinematicVideos />} />
          <Route path="/prewedvideos" element={<PreWedVideos />} />
          <Route path="/contactus" element={<ContactUs />} />
          <Route path="/modellingshoot" element={<Modelling />} />
          <Route path="/workwithus" element={<WorkWithUs />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <footer>
          <Footer />
        </footer>
      </main>
      </>
      )}
    </>
  ) : (
    <Routes>
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/upload" element={<UploadPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
