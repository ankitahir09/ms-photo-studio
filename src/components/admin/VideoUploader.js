"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import MediaGrid from "./MediaGrid";

export default function VideoUploader() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const videoCats = data.categories.filter((c) => c.type === "video");
          setCategories(videoCats);
          if (videoCats.length > 0) setSelectedCategory(videoCats[0].slug);
        }
      });
  }, []);

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (selected.size > 100 * 1024 * 1024) { // 100MB limit
        toast.error("File size must be less than 100MB");
        e.target.value = '';
        return;
      }
      setFile(selected);
    }
  };

  const handleUpload = async () => {
    if (!selectedCategory || !file) {
      toast.error("Select a category and a video file");
      return;
    }

    setUploading(true);
    setProgress(10);

    try {
      // 1. Get Signature from backend
      const sigRes = await fetch("/api/videos/signature", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          timestamp: Math.round(new Date().getTime() / 1000),
          folder: `murlidhar-studio/videos/${selectedCategory}`
        }),
      });
      const sigData = await sigRes.json();
      
      if (!sigData.success) {
        throw new Error("Failed to get signature");
      }
      
      setProgress(30);

      // 2. Upload to Cloudinary direct via form data
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", sigData.apiKey);
      formData.append("timestamp", sigData.timestamp);
      formData.append("signature", sigData.signature);
      formData.append("folder", sigData.folder);
      
      // Since it's a video, resource_type is video
      const cloudUrl = `https://api.cloudinary.com/v1_1/${sigData.cloudName}/video/upload`;
      
      const xhr = new XMLHttpRequest();
      
      const uploadPromise = new Promise((resolve, reject) => {
        xhr.upload.addEventListener("progress", (e) => {
          if (e.lengthComputable) {
            // Scale progress from 30 to 90
            const percentage = Math.round((e.loaded * 60) / e.total);
            setProgress(30 + percentage);
          }
        });
        
        xhr.addEventListener("load", () => resolve(JSON.parse(xhr.responseText)));
        xhr.addEventListener("error", () => reject(new Error("Upload failed")));
        xhr.addEventListener("abort", () => reject(new Error("Upload aborted")));
        
        xhr.open("POST", cloudUrl);
        xhr.send(formData);
      });

      const cloudinaryData = await uploadPromise;

      if (!cloudinaryData.secure_url) {
        throw new Error(cloudinaryData.error?.message || "Cloudinary upload failed");
      }
      
      setProgress(95);

      // 3. Save to DB
      const saveRes = await fetch("/api/videos/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          public_id: cloudinaryData.public_id,
          url: cloudinaryData.secure_url,
          category: selectedCategory,
        }),
      });
      
      const saveData = await saveRes.json();
      if (!saveData.success) throw new Error(saveData.error);
      
      setProgress(100);
      toast.success("Video uploaded successfully");
      
      // Reset state
      setFile(null);
      document.getElementById('video-upload').value = '';
      setRefreshKey(prev => prev + 1);

    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to upload video");
    } finally {
      setTimeout(() => {
        setUploading(false);
        setProgress(0);
      }, 1000);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-semibold mb-6">Upload Video (Max 100MB)</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[var(--color-gold-500)] focus:border-[var(--color-gold-500)] sm:text-sm p-3 border"
            disabled={uploading}
          >
            {categories.map((c) => (
              <option key={c._id} value={c.slug}>
                {c.title}
              </option>
            ))}
            {categories.length === 0 && <option disabled>No video categories found</option>}
          </select>
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Video File</label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-purple-500 transition-colors">
            <div className="space-y-1 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <div className="flex text-sm text-gray-600 justify-center mt-2">
                <label htmlFor="video-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-purple-600 hover:text-purple-500 focus-within:outline-none">
                  <span>Choose a video</span>
                  <input id="video-upload" name="video-upload" type="file" className="sr-only" accept="video/mp4,video/webm,video/mov" onChange={handleFileSelect} disabled={uploading} />
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-2">MP4, WebM, MOV up to 100MB</p>
            </div>
          </div>
          {file && (
            <p className="mt-2 text-sm text-gray-600 font-medium">Selected: {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)</p>
          )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-end gap-4">
        {uploading && (
          <div className="w-full max-w-md mr-4">
            <div className="flex justify-between mb-1">
              <span className="text-xs font-medium text-purple-700">Uploading to Cloudinary</span>
              <span className="text-xs font-medium text-purple-700">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-purple-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        )}
        <button
          onClick={handleUpload}
          disabled={uploading || !file || categories.length === 0}
          className="inline-flex justify-center py-3 px-8 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto transition-colors"
        >
          {uploading ? "Processing..." : "Upload Video"}
        </button>
      </div>

      {selectedCategory && (
        <div key={refreshKey} className="mt-8 pt-8 border-t border-gray-200">
          <MediaGrid category={selectedCategory} type="video" />
        </div>
      )}
    </div>
  );
}
