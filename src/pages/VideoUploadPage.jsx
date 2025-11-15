// === VideoUploadPage.jsx ===
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FullscreenLoader from "../components/FullscreenLoader";

function VideoUploadPage() {
  const [video, setVideo] = useState(null);
  const [category, setCategory] = useState("kidvideos");
  const [uploadedVideos, setUploadedVideos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [message, setMessage] = useState({ type: "", text: "" });
  const navigate = useNavigate();

  // Helper to check token expiration
  function isTokenExpired(token) {
    if (!token) return true;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return Date.now() >= payload.exp * 1000;
    } catch {
      return true;
    }
  }

  // Token check on mount only
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || isTokenExpired(token)) {
      localStorage.removeItem("token");
      navigate("/admin");
    }
  }, [navigate]);

  // Fetch uploaded videos whenever category changes
  useEffect(() => {
    const fetchWithRetry = async (url, options, retries = 2, delay = 1000) => {
      try {
        const res = await fetch(url, options);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res;
      } catch (err) {
        if (retries > 0) {
          await new Promise((r) => setTimeout(r, delay));
          return fetchWithRetry(url, options, retries - 1, delay);
        } else {
          throw err;
        }
      }
    };

    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchVideos = async () => {
      try {
        const res = await fetchWithRetry(`/api/videos?category=${category}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        if (data && data.success && Array.isArray(data.videos)) {
          setUploadedVideos(data.videos);
        } else {
          setUploadedVideos([]);
        }
      } catch (err) {
        console.error("Failed to fetch videos:", err);
        setUploadedVideos([]);
      }
    };

    fetchVideos();
  }, [category]);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setVideo(null);
      return;
    }

    // Check file type
    const validTypes = [
      "video/mp4",
      "video/quicktime",
      "video/x-msvideo",
      "video/webm",
      "video/ogg",
    ];
    const validExtensions = [".mp4", ".mov", ".avi", ".webm", ".ogg"];
    const fileExtension = "." + file.name.split(".").pop().toLowerCase();

    if (
      !validTypes.includes(file.type) &&
      !validExtensions.includes(fileExtension)
    ) {
      setMessage({
        type: "error",
        text: "Invalid file type. Please upload MP4, MOV, AVI, WEBM, or OGG files.",
      });
      setVideo(null);
      e.target.value = "";
      return;
    }

    // Check file size (100 MB = 100 * 1024 * 1024 bytes)
    const maxSize = 100 * 1024 * 1024;
    if (file.size > maxSize) {
      setMessage({
        type: "error",
        text: "File size exceeds 100 MB limit. Please choose a smaller file.",
      });
      setVideo(null);
      e.target.value = "";
      return;
    }

    setVideo(file);
    setMessage({ type: "", text: "" });
  };

  const handleUpload = async () => {
    if (!video) {
      setMessage({ type: "error", text: "Please select a video file." });
      return;
    }

    const token = localStorage.getItem("token");
    if (!token || isTokenExpired(token)) {
      localStorage.removeItem("token");
      navigate("/admin");
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setMessage({ type: "", text: "" });

    try {
      // Step 1: Get Cloudinary upload signature from backend
      const timestamp = Math.round(new Date().getTime() / 1000);
      const signatureRes = await fetch("/api/videos/signature", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          timestamp,
          folder: "murlidhar-studio/videos",
        }),
      });

      if (!signatureRes.ok) {
        let errorMessage = "Failed to get upload signature";
        try {
          const error = await signatureRes.json();
          // Fix React Error #31: Ensure error is a string
          errorMessage = error?.error 
            ? (typeof error.error === 'string' ? error.error : String(error.error))
            : errorMessage;
        } catch (parseErr) {
          errorMessage = `Failed to get signature: ${signatureRes.status} ${signatureRes.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const { signature, cloudName, apiKey, folder } = await signatureRes.json();

      // Step 2: Upload directly to Cloudinary
      // IMPORTANT: FormData fields must match the signature parameters exactly
      // The order doesn't matter, but all signed parameters must be included
      const cloudinaryFormData = new FormData();
      cloudinaryFormData.append("file", video);
      cloudinaryFormData.append("api_key", apiKey);
      cloudinaryFormData.append("timestamp", timestamp.toString()); // Ensure it's a string
      cloudinaryFormData.append("signature", signature);
      cloudinaryFormData.append("folder", folder);
      cloudinaryFormData.append("resource_type", "video");

      const xhr = new XMLHttpRequest();

      // Track upload progress
      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          const percentComplete = (e.loaded / e.total) * 100;
          setUploadProgress(percentComplete);
        }
      });

      xhr.addEventListener("load", async () => {
        if (xhr.status === 200) {
          try {
            const cloudinaryResult = JSON.parse(xhr.responseText);

            // Validate Cloudinary response
            if (!cloudinaryResult.public_id || !cloudinaryResult.secure_url) {
              throw new Error("Invalid response from Cloudinary upload");
            }

            // Step 3: Save video URL to MongoDB
            const saveRes = await fetch("/api/videos/save", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                public_id: cloudinaryResult.public_id,
                url: cloudinaryResult.secure_url,
                category,
              }),
            });

            const saveData = await saveRes.json();

            if (saveRes.ok && saveData.success) {
              setMessage({
                type: "success",
                text: saveData.message || "✅ Video uploaded successfully",
              });
              setVideo(null);
              setUploadProgress(0);
              setUploadedVideos(saveData.videos || []);
              // Reset file input
              const fileInput = document.getElementById("videoInput");
              if (fileInput) fileInput.value = "";
            } else {
              // Fix React Error #31: Ensure error is a string
              const errorMsg = saveData?.error 
                ? (typeof saveData.error === 'string' ? saveData.error : String(saveData.error))
                : "Failed to save video";
              throw new Error(errorMsg);
            }
          } catch (err) {
            console.error("Save error:", err);
            // Fix React Error #31: Ensure error message is always a string
            const errorMsg = err?.message 
              ? (typeof err.message === 'string' ? err.message : String(err.message))
              : "Upload succeeded but failed to save. Please try again.";
            setMessage({
              type: "error",
              text: errorMsg,
            });
          }
        } else {
          // Handle Cloudinary error response
          let errorMessage = "Upload failed. Please try again.";
          try {
            const responseText = xhr.responseText;
            if (responseText) {
              const error = JSON.parse(responseText);
              // Fix React Error #31: Ensure error is a string
              errorMessage = error?.error 
                ? (typeof error.error === 'string' ? error.error : String(error.error))
                : error?.message
                ? (typeof error.message === 'string' ? error.message : String(error.message))
                : errorMessage;
            }
          } catch (parseErr) {
            // If response is not JSON, use status-based message
            if (xhr.status === 401) {
              errorMessage = "Unauthorized: Invalid Cloudinary credentials or signature";
            } else if (xhr.status === 400) {
              errorMessage = "Bad request: Invalid upload parameters";
            } else {
              errorMessage = `Upload failed with status ${xhr.status}`;
            }
          }
          setMessage({
            type: "error",
            text: errorMessage,
          });
        }
        setUploading(false);
      });

      xhr.addEventListener("error", () => {
        setMessage({
          type: "error",
          text: "Network error. Please check your connection and try again.",
        });
        setUploading(false);
        setUploadProgress(0);
      });

      // Upload to Cloudinary
      xhr.open(
        "POST",
        `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`
      );
      xhr.send(cloudinaryFormData);
    } catch (err) {
      console.error("Upload error:", err);
      // Fix React Error #31: Ensure error message is always a string
      const errorMsg = err?.message 
        ? (typeof err.message === 'string' ? err.message : String(err.message))
        : (err?.toString ? err.toString() : "Upload failed. Please try again.");
      setMessage({
        type: "error",
        text: errorMsg,
      });
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDeleteUploaded = async (public_id) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    if (!confirm("Are you sure you want to delete this video?")) {
      return;
    }

    try {
      const res = await fetch(`/api/videos`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ public_id, category }),
      });

      const data = await res.json();
      if (data.success) {
        setUploadedVideos(data.videos || []);
        setMessage({ type: "success", text: "Video deleted successfully" });
      } else {
        // Fix React Error #31: Ensure error is a string
        const errorMsg = data?.error 
          ? (typeof data.error === 'string' ? data.error : String(data.error))
          : "Failed to delete video";
        setMessage({ type: "error", text: errorMsg });
      }
    } catch (err) {
      console.error("Delete error:", err);
      // Fix React Error #31: Ensure error message is always a string
      const errorMsg = err?.message 
        ? (typeof err.message === 'string' ? err.message : String(err.message))
        : "Failed to delete video";
      setMessage({ type: "error", text: errorMsg });
    }
  };

  return (
    <>
      {uploading && <FullscreenLoader />}
      <div className="p-4 max-w-xl mx-auto space-y-4">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Upload Videos</h2>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={() => navigate("/upload")}
            >
              Upload Images
            </button>
          </div>

          <div className="space-y-3">
            <select
              className="border p-2 rounded w-full"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="kidvideos">kids videos</option>
              <option value="cinvideos">cinematic videos</option>
              <option value="prewedvideos">prewedding videos</option>
            </select>
            <input
              type="file"
              accept="video/mp4,video/quicktime,video/x-msvideo,video/webm,video/ogg,.mp4,.mov,.avi,.webm,.ogg"
              onChange={handleFile}
              id="videoInput"
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              disabled={uploading}
            />

            {video && (
              <div className="p-3 bg-gray-100 rounded">
                <p className="text-sm text-gray-700">
                  Selected: <strong>{video.name}</strong>
                </p>
                <p className="text-xs text-gray-500">
                  Size: {(video.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            )}

            {uploading && (
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
                <p className="text-sm text-gray-600 mt-1 text-center">
                  Uploading... {Math.round(uploadProgress)}%
                </p>
              </div>
            )}

            {message.text && (
              <div
                className={`p-3 rounded ${
                  message.type === "error"
                    ? "bg-red-100 text-red-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {message.text}
              </div>
            )}

            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
              onClick={handleUpload}
              disabled={uploading || !video}
            >
              {uploading ? "Uploading..." : "Upload Video"}
            </button>
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-2">
            Uploaded Videos ({uploadedVideos.length})
          </h3>
          <div className="space-y-3">
            {uploadedVideos.length === 0 ? (
              <p className="text-gray-500 text-sm">No videos uploaded yet.</p>
            ) : (
              uploadedVideos.map((vid) => (
                <div
                  key={vid.public_id}
                  className="flex items-center gap-3 border p-3 rounded shadow"
                >
                  <video
                    src={vid.url}
                    className="w-32 h-20 object-cover rounded"
                    controls
                    preload="metadata"
                  />
                  <div className="flex-1">
                    <p className="text-sm text-gray-700 truncate">
                      {vid.public_id}
                    </p>
                    <p className="text-xs text-gray-500">
                      Uploaded: {new Date(vid.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    className="ml-auto bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    onClick={() => handleDeleteUploaded(vid.public_id)}
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <button
          className="text-sm text-red-600 hover:underline"
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/admin");
          }}
        >
          Logout
        </button>
      </div>
    </>
  );
}

export default VideoUploadPage;

