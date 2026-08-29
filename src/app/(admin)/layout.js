"use client";
import AdminSidebar from "@/components/layout/AdminSidebar";
import { usePathname } from "next/navigation";
import { Toaster } from "react-hot-toast";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin";

  if (isLoginPage) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <Toaster position="top-center" />
        {children}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="ml-64 flex-1 flex flex-col">
        <main className="flex-1 p-8">
          <Toaster position="top-right" />
          {children}
        </main>
      </div>
    </div>
  );
}
