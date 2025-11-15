import { useEffect, useState } from "react";
import { getApiBaseUrl } from "../utils/apiBase";

function useVideoData(category) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let retries = 0;
    const maxRetries = 2;

    const fetchVideos = async () => {
      try {
        const base = getApiBaseUrl();
        const res = await fetch(`${base}/api/videos?category=${category}`, {
          headers: { 'Accept': 'application/json' },
          credentials: 'omit'
        });

        if (!res.ok) {
          if (retries < maxRetries) {
            retries += 1;
            setTimeout(fetchVideos, 1200);
            return;
          } else if (res.status === 500) {
            throw new Error("Server error: Check if backend is running and database is connected");
          } else if (res.status === 404) {
            throw new Error("API endpoint not found");
          } else {
            throw new Error(`HTTP ${res.status}: Failed to fetch videos`);
          }
        }

        const data = await res.json();
        if (data && data.success && data.videos) {
          setVideos(data.videos);
          setError(null);
        } else if (data && data.error) {
          throw new Error(data.error);
        } else {
          setVideos([]);
        }
      } catch (err) {
        if (retries < maxRetries) {
          retries += 1;
          setTimeout(fetchVideos, 1200);
        } else {
          setError(err.message);
          setVideos([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [category]);

  return { videos, loading, error };
}

export { useVideoData };

