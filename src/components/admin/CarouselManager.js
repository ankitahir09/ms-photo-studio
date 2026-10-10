"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import MediaGrid from "./MediaGrid";

export default function CarouselManager() {
  const [activeSubTab, setActiveSubTab] = useState("categories"); // "categories" | "hero"
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadingCatId, setUploadingCatId] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Gallery picker modal state
  const [galleryModalOpen, setGalleryModalOpen] = useState(false);
  const [currentModalCategory, setCurrentModalCategory] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [selectedGalleryImage, setSelectedGalleryImage] = useState(null);

  // Hero slideshow refresh trigger
  const [heroRefreshKey, setHeroRefreshKey] = useState(0);
  const [heroFiles, setHeroFiles] = useState([]);
  const [heroUploading, setHeroUploading] = useState(false);

  const fileInputRefs = useRef({});

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      if (data.success) {
        // Exclude internal homeBg from carousel cards list
        const carouselCats = data.categories.filter((c) => c.slug !== "homeBg");
        setCategories(carouselCats);
      } else {
        toast.error("Failed to load carousel categories");
      }
    } catch (err) {
      toast.error("Error loading categories");
    } finally {
      setLoading(false);
    }
  };

  // Upload new photo directly from local machine
  const handleFileUpload = async (category, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCatId(category._id);
    setUploadProgress(20);

    const formData = new FormData();
    formData.append("image", file);
    formData.append("categoryId", category._id);

    try {
      setUploadProgress(50);
      const res = await fetch("/api/categories/cover", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      setUploadProgress(90);
      if (data.success) {
        toast.success(`Updated carousel photo for ${category.title}!`);
        // Update local state immediately
        setCategories((prev) =>
          prev.map((c) =>
            c._id === category._id ? { ...c, coverImage: data.coverImage } : c
          )
        );
      } else {
        toast.error(data.error || "Failed to upload photo");
      }
    } catch (err) {
      toast.error("Error uploading carousel photo");
    } finally {
      setUploadingCatId(null);
      setUploadProgress(0);
      // Reset input value
      if (fileInputRefs.current[category._id]) {
        fileInputRefs.current[category._id].value = "";
      }
    }
  };

  // Open modal to choose from category's existing images
  const openGalleryModal = async (category) => {
    setCurrentModalCategory(category);
    setSelectedGalleryImage(category.coverImage || null);
    setGalleryModalOpen(true);
    setGalleryLoading(true);

    try {
      const res = await fetch(`/api/images?category=${category.slug}`);
      const data = await res.json();
      if (data.success) {
        setGalleryImages(data.images || []);
      } else {
        toast.error("Failed to load gallery images");
      }
    } catch (err) {
      toast.error("Error loading gallery images");
    } finally {
      setGalleryLoading(false);
    }
  };

  // Save selected image from modal as cover photo
  const handleSaveFromGallery = async () => {
    if (!selectedGalleryImage || !currentModalCategory) return;

    try {
      const res = await fetch("/api/categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          _id: currentModalCategory._id,
          coverImage: selectedGalleryImage,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Updated ${currentModalCategory.title} carousel photo!`);
        setCategories((prev) =>
          prev.map((c) =>
            c._id === currentModalCategory._id
              ? { ...c, coverImage: selectedGalleryImage }
              : c
          )
        );
        setGalleryModalOpen(false);
      } else {
        toast.error(data.error || "Failed to update photo");
      }
    } catch (err) {
      toast.error("Error saving carousel photo");
    }
  };

  // Toggle category active in carousel
  const handleToggleActive = async (category) => {
    const updatedStatus = !category.isActive;
    try {
      const res = await fetch("/api/categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          _id: category._id,
          isActive: updatedStatus,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(
          `${category.title} is now ${updatedStatus ? "visible" : "hidden"} in the carousel`
        );
        setCategories((prev) =>
          prev.map((c) =>
            c._id === category._id ? { ...c, isActive: updatedStatus } : c
          )
        );
      }
    } catch (err) {
      toast.error("Failed to toggle visibility");
    }
  };

  // Upload hero slides
  const handleHeroUpload = async () => {
    if (heroFiles.length === 0) {
      toast.error("Please select images for hero slides");
      return;
    }

    setHeroUploading(true);
    let successCount = 0;

    for (let i = 0; i < heroFiles.length; i++) {
      const file = heroFiles[i];
      const formData = new FormData();
      formData.append("image", file);
      formData.append("category", "homeBg");

      try {
        const res = await fetch("/api/images", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (data.success) successCount++;
      } catch (err) {
        console.error(err);
      }
    }

    if (successCount > 0) {
      toast.success(`Uploaded ${successCount} hero slide(s)!`);
      setHeroFiles([]);
      setHeroRefreshKey((prev) => prev + 1);
      const input = document.getElementById("hero-file-upload");
      if (input) input.value = "";
    } else {
      toast.error("Failed to upload hero slides");
    }
    setHeroUploading(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Description */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-cormorant text-gray-900">
            Carousel Photos Management
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Easily change, upload, or pick the photos displayed across the homepage carousels.
          </p>
        </div>

        {/* Tab switch buttons */}
        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveSubTab("categories")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
              activeSubTab === "categories"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Selected Works Cards ({categories.length})
          </button>
          <button
            onClick={() => setActiveSubTab("hero")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
              activeSubTab === "hero"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Hero Slideshow Banner
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: Category Carousel Cards */}
      {activeSubTab === "categories" && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Homepage Selected Works Carousel Cards
              </h3>
              <p className="text-sm text-gray-500">
                These photos appear on the large interactive Swiper carousel on the homepage. Click <strong>Upload Photo</strong> or <strong>Pick from Gallery</strong> to change any card.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-96 bg-gray-100 rounded-xl" />
              ))}
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No carousel categories found.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((cat) => {
                const isUploadingThis = uploadingCatId === cat._id;

                return (
                  <div
                    key={cat._id}
                    className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow flex flex-col bg-white"
                  >
                    {/* Card Photo Preview */}
                    <div className="relative h-64 w-full bg-gray-100 overflow-hidden group">
                      {cat.coverImage ? (
                        <Image
                          src={cat.coverImage}
                          alt={cat.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                          No cover photo assigned
                        </div>
                      )}

                      {/* Dark overlay with category info */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

                      {/* Badges on top */}
                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-black/60 text-white backdrop-blur-md uppercase tracking-wider">
                          {cat.type === "video" ? "Films" : "Photography"}
                        </span>
                      </div>

                      <div className="absolute top-3 right-3">
                        <button
                          onClick={() => handleToggleActive(cat)}
                          title="Toggle visibility in carousel"
                          className={`px-2.5 py-1 text-xs font-medium rounded-full transition-colors backdrop-blur-md ${
                            cat.isActive
                              ? "bg-emerald-600/90 text-white"
                              : "bg-red-600/90 text-white"
                          }`}
                        >
                          {cat.isActive ? "Visible" : "Hidden"}
                        </button>
                      </div>

                      {/* Bottom title preview */}
                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <h4 className="text-xl font-bold font-cormorant drop-shadow-sm">
                          {cat.title}
                        </h4>
                        <p className="text-xs text-gray-300 font-mono mt-0.5">
                          {cat.route}
                        </p>
                      </div>

                      {/* Uploading indicator overlay */}
                      {isUploadingThis && (
                        <div className="absolute inset-0 bg-black/75 flex flex-col items-center justify-center text-white z-20">
                          <div className="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mb-2" />
                          <p className="text-sm font-medium">
                            Uploading photo... {uploadProgress}%
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Card Actions */}
                    <div className="p-4 bg-gray-50 flex-1 flex flex-col justify-between border-t border-gray-100">
                      <div className="text-xs text-gray-500 mb-3 line-clamp-2">
                        {cat.description || "Carousel card presentation photo."}
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        {/* Hidden file input */}
                        <input
                          type="file"
                          accept="image/*"
                          ref={(el) => (fileInputRefs.current[cat._id] = el)}
                          className="hidden"
                          onChange={(e) => handleFileUpload(cat, e)}
                          disabled={isUploadingThis}
                        />

                        {/* Upload from PC */}
                        <button
                          onClick={() =>
                            fileInputRefs.current[cat._id]?.click()
                          }
                          disabled={isUploadingThis}
                          className="px-3 py-2 text-xs font-semibold rounded-lg bg-gray-900 text-white hover:bg-black transition-colors flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3.5 w-3.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                            />
                          </svg>
                          Upload Photo
                        </button>

                        {/* Pick from existing gallery */}
                        <button
                          onClick={() => openGalleryModal(cat)}
                          disabled={isUploadingThis}
                          className="px-3 py-2 text-xs font-semibold rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3.5 w-3.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          Pick from Gallery
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 2: Hero Slideshow Carousel (homeBg) */}
      {activeSubTab === "hero" && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Homepage Hero Slideshow Backgrounds
            </h3>
            <p className="text-sm text-gray-500">
              Manage the full-screen looping background photos that appear in the hero section at the top of the homepage.
            </p>
          </div>

          {/* Upload new hero slide */}
          <div className="p-6 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50/50 hover:border-gray-400 transition-colors">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-semibold text-gray-800">
                  Add New Hero Slides
                </h4>
                <p className="text-xs text-gray-500">
                  Recommended: High-resolution landscape images (1920x1080 or higher).
                </p>
              </div>

              <div className="flex items-center gap-3">
                <input
                  id="hero-file-upload"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) =>
                    setHeroFiles(Array.from(e.target.files || []))
                  }
                  className="text-xs text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-gray-900 file:text-white hover:file:bg-black cursor-pointer"
                />

                <button
                  onClick={handleHeroUpload}
                  disabled={heroUploading || heroFiles.length === 0}
                  className="px-5 py-2 text-xs font-semibold rounded-md bg-amber-600 text-white hover:bg-amber-700 disabled:opacity-50 transition-colors"
                >
                  {heroUploading ? "Uploading..." : `Upload (${heroFiles.length})`}
                </button>
              </div>
            </div>
          </div>

          {/* Current Hero Slides with Drag & Drop */}
          <div key={heroRefreshKey}>
            <MediaGrid category="homeBg" type="image" />
          </div>
        </div>
      )}

      {/* MODAL: Pick Image from Existing Category Gallery */}
      {galleryModalOpen && currentModalCategory && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900 font-cormorant">
                  Select Cover Photo for {currentModalCategory.title}
                </h3>
                <p className="text-xs text-gray-500">
                  Choose any photo already uploaded to the &quot;{currentModalCategory.title}&quot; gallery.
                </p>
              </div>
              <button
                onClick={() => setGalleryModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Modal Body / Gallery Grid */}
            <div className="p-6 flex-1 overflow-y-auto">
              {galleryLoading ? (
                <div className="flex items-center justify-center h-48">
                  <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : galleryImages.length === 0 ? (
                <div className="text-center py-16 text-gray-500">
                  <p>No photos uploaded to this category yet.</p>
                  <p className="text-xs text-gray-400 mt-1">
                    You can upload photos directly from your computer using the &quot;Upload Photo&quot; button.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {galleryImages.map((img) => {
                    const isSelected = selectedGalleryImage === img.url;

                    return (
                      <div
                        key={img._id}
                        onClick={() => setSelectedGalleryImage(img.url)}
                        className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all group ${
                          isSelected
                            ? "border-amber-500 ring-4 ring-amber-500/20 scale-95"
                            : "border-transparent hover:border-gray-300"
                        }`}
                      >
                        <Image
                          src={img.url.replace("/upload/", "/upload/w_300/")}
                          alt="Gallery item"
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                        {isSelected && (
                          <div className="absolute inset-0 bg-amber-500/20 flex items-center justify-center">
                            <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-lg">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
              <div className="text-xs text-gray-500">
                {selectedGalleryImage ? "1 photo selected" : "Click a photo to select it"}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setGalleryModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveFromGallery}
                  disabled={!selectedGalleryImage}
                  className="px-5 py-2 text-xs font-semibold rounded-lg bg-gray-900 text-white hover:bg-black disabled:opacity-50 transition-colors shadow-sm"
                >
                  Apply as Carousel Photo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
