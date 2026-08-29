"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import MediaGrid from "./MediaGrid";

export default function ImageUploader() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const photoCats = data.categories.filter(
            (c) => c.type === "photo" || c.slug === "homeBg",
          );
          setCategories(photoCats);
          console.log(photoCats);

          if (photoCats.length > 0) setSelectedCategory(photoCats[0].slug);
        }
      });
  }, []);

  const handleFileSelect = (e) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleUpload = async () => {
    if (!selectedCategory) {
      toast.error("Please select a category");
      return;
    }
    if (files.length === 0) {
      toast.error("Please select files to upload");
      return;
    }

    setUploading(true);
    setProgress(0);
    let successCount = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append("image", file);
      formData.append("category", selectedCategory);

      try {
        const res = await fetch("/api/images", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (data.success) {
          successCount++;
        } else {
          toast.error(`Failed to upload ${file.name}`);
        }
      } catch (error) {
        toast.error(`Error uploading ${file.name}`);
      }

      setProgress(Math.round(((i + 1) / files.length) * 100));
    }

    if (successCount > 0) {
      toast.success(`Successfully uploaded ${successCount} images`);
      setFiles([]);
      setRefreshKey((prev) => prev + 1); // trigger refetch in MediaGrid
      // reset file input
      document.getElementById("file-upload").value = "";
    }
    setUploading(false);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-semibold mb-6">Upload Images</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
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
          </select>
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Files
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-[var(--color-gold-500)] transition-colors">
            <div className="space-y-1 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="flex text-sm text-gray-600 justify-center">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-[var(--color-gold-600)] hover:text-[var(--color-gold-500)] focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[var(--color-gold-500)]"
                >
                  <span>Upload a file</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    multiple
                    accept="image/*"
                    onChange={handleFileSelect}
                    disabled={uploading}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, WEBP up to 10MB</p>
            </div>
          </div>
          {files.length > 0 && (
            <p className="mt-2 text-sm text-gray-500">
              {files.length} files selected
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-end">
        {uploading && (
          <div className="w-full max-w-xs mr-4 bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-[var(--color-gold-500)] h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}
        <button
          onClick={handleUpload}
          disabled={uploading || files.length === 0}
          className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#111] hover:bg-[#222] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? `Uploading ${progress}%` : "Upload Files"}
        </button>
      </div>

      {selectedCategory && (
        <div key={refreshKey} className="mt-8 pt-8 border-t border-gray-200">
          <MediaGrid category={selectedCategory} type="image" />
        </div>
      )}
    </div>
  );
}
