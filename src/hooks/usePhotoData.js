import { useEffect, useState } from "react";
import { getApiBaseUrl } from "../utils/apiBase";

function usePhotoData(category) {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
  let retries = 0;
  const maxRetries = 2;

  const fetchPhotos = async () => {
    try {
      const base = getApiBaseUrl();
      const res = await fetch(`${base}/api/images?category=${category}`, {
        headers: { 'Accept': 'application/json' },
        credentials: 'omit'
      });

      if (!res.ok) {
        if (retries < maxRetries) {
          retries += 1;
          setTimeout(fetchPhotos, 1200);
          return;
        } else if (res.status === 500) {
          throw new Error("Server error: Check if backend is running and database is connected");
        } else if (res.status === 404) {
          throw new Error("API endpoint not found");
        } else {
          throw new Error(`HTTP ${res.status}: Failed to fetch photos`);
        }
      }

      const data = await res.json();
      if (data && data.success && data.images) {
        setPhotos(data.images);
        setError(null);
      } else if (data && data.error) {
        throw new Error(data.error);
      } else {
        setPhotos([]);
      }
    } catch (err) {
      if (retries < maxRetries) {
        retries += 1;
        setTimeout(fetchPhotos, 1200);
      } else {
        setError(err.message);
        setPhotos([]);
      }
    } finally {
      setLoading(false);
    }
  };

  fetchPhotos();
}, [category]);


  return { photos, loading, error };
}

export { usePhotoData };
