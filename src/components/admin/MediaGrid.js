"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

export default function MediaGrid({ category, type = "image" }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const endpoint = type === "image" ? `/api/images?category=${category}` : `/api/videos?category=${category}`;
      const res = await fetch(endpoint);
      const data = await res.json();
      if (data.success) {
        setItems(type === "image" ? data.images : data.videos);
      }
    } catch (error) {
      toast.error(`Failed to load ${type}s`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (category) fetchItems();
  }, [category]);

  const handleDelete = async (id) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;

    try {
      const endpoint = type === "image" ? `/api/images?id=${id}` : `/api/videos?id=${id}`;
      const res = await fetch(endpoint, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast.success(`${type} deleted successfully`);
        setItems(items.filter((item) => item._id !== id));
      } else {
        toast.error(`Failed to delete ${type}`);
      }
    } catch (error) {
      toast.error(`Error deleting ${type}`);
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const newItems = Array.from(items);
    const [reorderedItem] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, reorderedItem);

    const updatedItems = newItems.map((item, index) => ({
      ...item,
      order: index,
    }));

    setItems(updatedItems);

    try {
      const res = await fetch(type === "image" ? "/api/images" : "/api/videos", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: updatedItems }),
      });
      if (!res.ok) throw new Error();
      toast.success("Order updated");
    } catch (error) {
      toast.error("Failed to update order");
    }
  };

  if (loading) {
    return <div className="py-8 flex justify-center"><div className="w-8 h-8 border-4 border-[var(--color-gold-500)] border-t-transparent rounded-full animate-spin"></div></div>;
  }

  if (items.length === 0) {
    return <div className="py-8 text-center text-gray-500 font-nunito bg-gray-50 rounded-xl border border-dashed border-gray-200">No media found in this category.</div>;
  }

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Managed Media ({items.length})</h3>
      
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="mediaGrid" direction="horizontal">
          {(provided) => (
            <div 
              {...provided.droppableProps} 
              ref={provided.innerRef}
              className={`grid gap-4 ${type === "image" ? "grid-cols-2 md:grid-cols-4 lg:grid-cols-5" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"}`}
            >
              {items.map((item, index) => (
                <Draggable key={item._id} draggableId={item._id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`relative rounded-lg overflow-hidden group bg-black ${type === "image" ? "aspect-square" : "aspect-video"} ${snapshot.isDragging ? "ring-2 ring-[var(--color-gold-500)] shadow-xl z-50 scale-105" : "hover:shadow-md"}`}
                    >
                      {type === "image" ? (
                        <Image
                          src={item.url.replace("/upload/", "/upload/w_400/")}
                          alt="Media"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <video src={item.url} className="w-full h-full object-cover opacity-70 group-hover:opacity-50 transition-opacity" />
                      )}
                      <div className={`absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-200 pointer-events-none ${type === "video" ? "opacity-0" : ""}`} />
                      
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 z-10"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                      
                      {type === "video" && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      )}

                      <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 text-white text-xs rounded opacity-0 group-hover:opacity-100 backdrop-blur-sm pointer-events-none z-10">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                        </svg>
                        Drag
                      </div>
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
  );
}
