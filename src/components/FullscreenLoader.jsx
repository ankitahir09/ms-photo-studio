// components/FullscreenLoader.jsx
import React from "react";

const FullscreenLoader = () => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
    </div>
  );
};

export default FullscreenLoader;
