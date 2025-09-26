import { useEffect, useState } from "react";

function usePhotoData(category) {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const res = await fetch(`/api/images/${category}`);
        
        if (!res.ok) {
          if (res.status === 500) {
            throw new Error("Server error: Check if backend is running and database is connected");
          } else if (res.status === 404) {
            throw new Error("API endpoint not found");
          } else {
            throw new Error(`HTTP ${res.status}: Failed to fetch photos`);
          }
        }
        
        const data = await res.json();
        
        // Handle new API response format
        if (data && data.success && data.images) {
          setPhotos(data.images);
        } else if (data && data.error) {
          throw new Error(data.error);
        } else {
          setPhotos([]);
        }
      } catch (err) {
        console.error(`Error fetching ${category} photos:`, err);
        setError(err.message);
        setPhotos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, [category]);

  return { photos, loading, error };
}

export { usePhotoData };
