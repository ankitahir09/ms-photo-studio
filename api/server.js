import express from "express";
import serverless from "serverless-http";

const app = express();

// Simple test route
app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    message: "✅ Serverless backend is working!",
    timestamp: new Date().toISOString()
  });
});

// Export handler for Vercel
export const handler = serverless(app);
