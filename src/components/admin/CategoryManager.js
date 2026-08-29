"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function CategoryManager() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      if (data.success) {
        const filteredData = data.categories.filter(
          (item) => item.slug !== "homeBg",
        );
        setCategories(filteredData);
      }
    } catch (error) {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure? This will delete the category definition (not the media).",
      )
    )
      return;

    try {
      const res = await fetch(`/api/categories?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast.success("Category deleted");
        fetchCategories();
      }
    } catch (error) {
      toast.error("Failed to delete category");
    }
  };

  return (
    <div className="w-full">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold mb-6">Existing Categories</h2>

        {loading ? (
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-16 bg-gray-100 rounded-lg w-full"
              ></div>
            ))}
          </div>
        ) : categories.length === 0 ? (
          <p className="text-gray-500">No categories found.</p>
        ) : (
          <div className="space-y-4">
            {categories.map((cat) => (
              <div
                key={cat._id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-(--color-gold-500) transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-md flex items-center justify-center text-white`}
                  >
                    {
                      <img
                        src={cat.coverImage}
                        alt={cat.title}
                        width={"100%"}
                        height={"100%"}
                        className="h-10 w-10"
                      />
                    }
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      {cat.title}
                      {!cat.isActive && (
                        <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                          Hidden
                        </span>
                      )}
                    </h3>
                    <p className="text-gray-500 font-mono text-xs">
                      {cat.route} • /{cat.slug}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleDelete(cat._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
