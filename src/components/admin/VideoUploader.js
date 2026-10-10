"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function VideoUploader() {
  const [videos, setVideos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("videos");
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [activePreview, setActivePreview] = useState(null);

  // Fetch all videos from /api/admin/videos
  const fetchVideos = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/videos");
      const data = await res.json();
      if (data.success) {
        setVideos(data.videos || []);
      } else {
        toast.error(data.error || "Failed to load videos");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error loading videos");
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories
  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const videoCats = data.categories.filter((c) => c.type === "video");
          setCategories(videoCats);
          if (videoCats.length > 0) {
            setSelectedCategory(videoCats[0].slug);
          }
        }
      })
      .catch(() => {});

    fetchVideos();
  }, []);

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      const maxBytes = 100 * 1024 * 1024; // 100MB limit

      if (selected.size > maxBytes) {
        toast.error("File size exceeds 100MB limit. Please select a smaller video.");
        e.target.value = "";
        return;
      }

      const ext = selected.name.split(".").pop()?.toLowerCase();
      const validExts = ["mp4", "mov", "webm", "avi"];
      if (!ext || !validExts.includes(ext)) {
        toast.error("Invalid format. Supported: MP4, MOV, WebM, AVI");
        e.target.value = "";
        return;
      }

      setFile(selected);
      if (!title) {
        setTitle(selected.name.replace(/\.[^/.]+$/, ""));
      }
    }
  };

  const handleUpload = async (e) => {
    e?.preventDefault();
    if (!file) {
      toast.error("Please select a video file");
      return;
    }

    setUploading(true);
    setProgress(15);

    try {
      const formData = new FormData();
      formData.append("video", file);
      formData.append("title", title || file.name);
      formData.append("category", selectedCategory || "videos");

      // XMLHttpRequest for tracking upload progress
      const xhr = new XMLHttpRequest();

      const uploadPromise = new Promise((resolve, reject) => {
        xhr.upload.addEventListener("progress", (event) => {
          if (event.lengthComputable) {
            const percent = Math.round((event.loaded / event.total) * 90);
            setProgress(Math.max(15, percent));
          }
        });

        xhr.addEventListener("load", () => {
          try {
            const response = JSON.parse(xhr.responseText);
            if (xhr.status >= 200 && xhr.status < 300 && response.success) {
              resolve(response);
            } else {
              reject(new Error(response.error || "Upload failed"));
            }
          } catch {
            reject(new Error("Invalid response from server"));
          }
        });

        xhr.addEventListener("error", () => reject(new Error("Network upload error")));
        xhr.addEventListener("abort", () => reject(new Error("Upload aborted")));

        xhr.open("POST", "/api/admin/videos/upload");
        xhr.send(formData);
      });

      const res = await uploadPromise;
      setProgress(100);
      toast.success(res.message || "Video uploaded successfully to Cloudinary");

      // Reset form
      setFile(null);
      setTitle("");
      const inputEl = document.getElementById("admin-video-file-input");
      if (inputEl) inputEl.value = "";

      // Refresh list
      await fetchVideos();
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to upload video");
    } finally {
      setTimeout(() => {
        setUploading(false);
        setProgress(0);
      }, 500);
    }
  };

  const handleDelete = async (videoId, videoTitle) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${videoTitle || "this video"}"? This will delete it from Cloudinary and the database.`
    );
    if (!confirmed) return;

    setDeletingId(videoId);
    try {
      const res = await fetch(`/api/admin/videos/${videoId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Video deleted successfully");
        setVideos((prev) => prev.filter((v) => v._id !== videoId));
      } else {
        toast.error(data.error || "Failed to delete video");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error deleting video");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Upload Card */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-2xl font-bold font-cormorant text-gray-900">
              Upload New Video
            </h2>
            <p className="text-xs text-gray-500 font-nunito mt-1">
              Videos will be saved directly under the dedicated &quot;videos&quot; folder in Cloudinary.
            </p>
          </div>
          <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-semibold rounded-full border border-purple-100">
            Max 100MB
          </span>
        </div>

        <form onSubmit={handleUpload} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 font-nunito mb-1">
                Video Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Cinematic Wedding Teaser"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition text-sm"
                disabled={uploading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 font-nunito mb-1">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition text-sm"
                disabled={uploading}
              >
                <option value="videos">General Videos</option>
                {categories.map((c) => (
                  <option key={c._id} value={c.slug}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 font-nunito mb-2">
              Select Video File (MP4, MOV, WebM, AVI)
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-purple-500 transition-colors bg-gray-50/50">
              <div className="space-y-2 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                <div className="flex text-sm text-gray-600 justify-center">
                  <label
                    htmlFor="admin-video-file-input"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-purple-600 hover:text-purple-500 px-3 py-1 border border-purple-200 shadow-sm"
                  >
                    <span>Browse Video File</span>
                    <input
                      id="admin-video-file-input"
                      type="file"
                      className="sr-only"
                      accept=".mp4,.mov,.webm,.avi,video/mp4,video/quicktime,video/webm,video/x-msvideo"
                      onChange={handleFileSelect}
                      disabled={uploading}
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500">
                  Supported: MP4, MOV, WebM, AVI (up to 100MB)
                </p>
                {file && (
                  <div className="pt-2 text-sm text-green-700 font-medium">
                    ✓ Selected: {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                  </div>
                )}
              </div>
            </div>
          </div>

          {uploading && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold text-purple-700">
                <span>Uploading to Cloudinary...</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-purple-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={uploading || !file}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-nunito font-semibold shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {uploading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Uploading Video ({progress}%)...</span>
                </>
              ) : (
                <span>Upload Video to Cloudinary</span>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Video Preview Modal */}
      {activePreview && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-2xl max-w-3xl w-full p-4 relative overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-white font-semibold truncate pr-4 text-sm">
                {activePreview.title || "Video Preview"}
              </h3>
              <button
                onClick={() => setActivePreview(null)}
                className="text-gray-400 hover:text-white text-lg p-1"
              >
                ✕
              </button>
            </div>
            <div className="aspect-video bg-black rounded-lg overflow-hidden">
              <video
                src={activePreview.url}
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      )}

      {/* Videos List / Grid */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold font-cormorant text-gray-900">
              Uploaded Videos ({videos.length})
            </h3>
            <p className="text-xs text-gray-500 font-nunito mt-1">
              All videos stored in Cloudinary &quot;videos&quot; folder and MongoDB
            </p>
          </div>
          <button
            onClick={fetchVideos}
            disabled={loading}
            className="text-xs px-3 py-1.5 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition"
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="py-16 flex justify-center items-center">
            <span className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : videos.length === 0 ? (
          <div className="py-16 text-center text-gray-400 font-nunito bg-gray-50 rounded-xl border border-dashed border-gray-200">
            No videos uploaded yet. Use the upload box above to add your first video!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((vid) => (
              <div
                key={vid._id}
                className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col"
              >
                {/* HTML5 Video Preview Player */}
                <div className="relative aspect-video bg-black group">
                  <video
                    src={vid.url}
                    preload="metadata"
                    controls
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => setActivePreview(vid)}
                    className="absolute top-2 right-2 bg-black/60 hover:bg-black/90 text-white text-xs px-2 py-1 rounded backdrop-blur transition opacity-0 group-hover:opacity-100"
                  >
                    Expand
                  </button>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm truncate" title={vid.title}>
                      {vid.title || "Untitled Video"}
                    </h4>
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                      <span className="px-2 py-0.5 bg-gray-200 rounded text-gray-700 capitalize">
                        {vid.category || "videos"}
                      </span>
                      {vid.bytes ? (
                        <span>{(vid.bytes / (1024 * 1024)).toFixed(1)} MB</span>
                      ) : null}
                      {vid.format ? (
                        <span className="uppercase">{vid.format}</span>
                      ) : null}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-200 flex items-center justify-between">
                    <span className="text-[11px] text-gray-400">
                      {vid.uploadedAt
                        ? new Date(vid.uploadedAt).toLocaleDateString()
                        : "Recently"}
                    </span>
                    <button
                      onClick={() => handleDelete(vid._id, vid.title)}
                      disabled={deletingId === vid._id}
                      className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-lg text-xs font-semibold transition disabled:opacity-50"
                    >
                      {deletingId === vid._id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
