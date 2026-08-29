"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import AnalyticsDashboard from "@/components/admin/AnalyticsDashboard";
import ImageUploader from "@/components/admin/ImageUploader";
import VideoUploader from "@/components/admin/VideoUploader";

export default function UploadPage() {
  return (
    <Suspense
      fallback={
        <div className="animate-pulse h-10 w-full bg-gray-200 rounded-lg"></div>
      }
    >
      <UploadContent />
    </Suspense>
  );
}

function UploadContent() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "dashboard";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8 border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold text-gray-900 font-cormorant">
          Admin Dashboard
        </h1>
      </div>

      {activeTab === "dashboard" && <AnalyticsDashboard />}
      {activeTab === "images" && <ImageUploader />}
      {activeTab === "videos" && <VideoUploader />}
    </div>
  );
}
