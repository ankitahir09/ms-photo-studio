import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FullscreenLoader from "../components/FullscreenLoader";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import imageCompression from "browser-image-compression";

function UploadPage() {
  const [images, setImages] = useState([]);
  const [category, setCategory] = useState("homeBg");
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  // Token validation
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || isTokenExpired(token)) {
      localStorage.removeItem("token");
      navigate("/admin");
    }
  }, [navigate]);

  function isTokenExpired(token) {
    if (!token) return true;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return Date.now() >= payload.exp * 1000;
    } catch {
      return true;
    }
  }

  // Fetch uploaded images
  const fetchImages = async (cat) => {
    try {
      const res = await fetch(`/api/images/${cat}`);
      const data = await res.json();
      if (data?.success && data.images) setUploadedImages(data.images);
      else setUploadedImages([]);
    } catch {
      setUploadedImages([]);
    }
  };

  useEffect(() => {
    fetchImages(category);
  }, [category]);

  const handleFiles = (e) => setImages(Array.from(e.target.files));

  const handleUpload = async () => {
    if (images.length === 0) return alert("Select files first");

    const token = localStorage.getItem("token");
    if (!token || isTokenExpired(token)) {
      localStorage.removeItem("token");
      navigate("/admin");
      return;
    }

    setUploading(true);
    const formData = new FormData();

    for (let img of images) {
      try {
        if (img.size > 10 * 1024 * 1024) {
          const options = { maxSizeMB: 9.5, maxWidthOrHeight: 6000, useWebWorker: true, initialQuality: 0.85 };
          const compressed = await imageCompression(img, options);
          formData.append("images", compressed);
        } else formData.append("images", img);
      } catch {
        formData.append("images", img);
      }
    }

    formData.append("category", category);

    const res = await fetch("/api/upload/upload", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const data = await res.json();
    alert(data.message || "Upload complete");
    setImages([]);
    setUploading(false);
    fetchImages(category);
  };

  const handleDeleteUploaded = async (public_id) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await fetch("/api/delete-image", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ public_id, category }),
    });

    const data = await res.json();
    fetchImages(category);
  };

  const onDragEnd = async (result) => {
    if (!result.destination) return;
    const reordered = Array.from(uploadedImages);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    setUploadedImages(reordered);

    const token = localStorage.getItem("token");
    if (!token || isTokenExpired(token)) {
      localStorage.removeItem("token");
      navigate("/admin");
      return;
    }

    await fetch("/api/update-order", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        images: reordered.map((img, i) => ({ public_id: img.public_id, order: i })),
      }),
    });
  };

  return (
    <>
      {uploading && <FullscreenLoader />}
      <div className="p-4 max-w-xl mx-auto space-y-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Upload Images</h2>
          <select className="border p-2 rounded" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="homeBg">Home Background</option>
            <option value="childphotos">Kids Photos</option>
            <option value="engagephotos">Engagement Photos</option>
            <option value="weddingphotos">Wedding Photos</option>
            <option value="prewedphotos">Prewedding Photos</option>
            <option value="maternityshoot">Maternity Photos</option>
            <option value="modellingshoot">Modelling Photos</option>
          </select>

          <input type="file" multiple onChange={handleFiles} id="fileInput" className="block my-2" />
          <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleUpload} disabled={uploading}>
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </div>

        <div>
          <h3 className="font-medium mb-1">Uploaded Images ({uploadedImages.length})</h3>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="uploaded">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                  {uploadedImages.map((img, index) => (
                    <Draggable key={img.public_id} draggableId={img.public_id} index={index}>
                      {(prov) => (
                        <div
                          ref={prov.innerRef}
                          {...prov.draggableProps}
                          {...prov.dragHandleProps}
                          className="flex items-center gap-2 border p-2 rounded shadow"
                        >
                          <img
                            loading="lazy"
                            src={`https://res.cloudinary.com/dkmv3uyvz/image/upload/f_auto,q_auto,w_1200/${img.public_id}`}
                            alt=""
                            className="w-20 h-20 object-cover rounded"
                          />
                          <button className="ml-auto bg-red-500 text-white px-3 py-1 rounded" onClick={() => handleDeleteUploaded(img.public_id)}>
                            Delete
                          </button>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
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

export default UploadPage;
