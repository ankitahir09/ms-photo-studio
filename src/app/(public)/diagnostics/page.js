import { connectToDatabase } from "@/lib/db";
import mongoose from "mongoose";

// Force dynamic rendering since diagnostics should be real-time
export const dynamic = 'force-dynamic';

export default async function DiagnosticsPage() {
  const start = Date.now();
  let dbStatus = "disconnected";
  let dbError = null;

  try {
    await connectToDatabase();
    dbStatus = mongoose.connection.readyState === 1 ? "connected" : "disconnected";
  } catch (err) {
    dbError = err.message;
  }

  const status = {
    uptime: process.uptime(),
    database: dbStatus,
    dbError,
    cloudinary: process.env.CLOUDINARY_CLOUD_NAME ? "configured" : "missing",
    timestamp: new Date().toISOString(),
    latency: Date.now() - start,
  };

  return (
    <div className="min-h-screen bg-[#f9f7f1] py-16 px-4 flex justify-center items-start">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-2xl w-full border border-gray-100">
        <h1 className="text-3xl font-cormorant font-bold mb-6 border-b pb-4">System Diagnostics</h1>
        
        <div className="space-y-6 font-nunito">
          
          <div className="grid grid-cols-2 gap-4 border-b pb-4">
            <span className="text-gray-500 font-semibold">Uptime</span>
            <span className="text-gray-900">{Math.floor(status.uptime)}s</span>
          </div>

          <div className="grid grid-cols-2 gap-4 border-b pb-4">
            <span className="text-gray-500 font-semibold">Database Connection</span>
            <span className={`font-semibold ${status.database === 'connected' ? 'text-green-600' : 'text-red-600'}`}>
              {status.database.toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 border-b pb-4">
            <span className="text-gray-500 font-semibold">Cloudinary Config</span>
            <span className={`font-semibold ${status.cloudinary === 'configured' ? 'text-green-600' : 'text-red-600'}`}>
              {status.cloudinary.toUpperCase()}
            </span>
          </div>

          {status.dbError && (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg mt-4 text-sm">
              <strong>Error: </strong> {status.dbError}
            </div>
          )}
          
          <div className="mt-8 pt-4 border-t flex flex-col gap-1 text-sm text-gray-400 text-center">
            <span>Timestamp: {status.timestamp}</span>
            <span>Server Render Latency: {status.latency}ms</span>
          </div>
        </div>
      </div>
    </div>
  );
}
