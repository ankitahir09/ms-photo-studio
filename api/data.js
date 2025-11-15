// === Unified Data API ===
// Merged routes:
// - GET /api/data (from api/data.js)
// - GET /api/data/[filename] (from api/data/[filename].js)
//
// This single handler manages all data file operations to reduce serverless function count.

import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Extract filename from query params or path
    const url = new URL(req.url, `http://${req.headers.host}`);
    const filename =
      req.query.filename ||
      url.searchParams.get("filename") ||
      url.pathname.split("/").pop();

    if (!filename) {
      return res.status(400).json({ error: "No filename provided" });
    }

    // Prevent path traversal
    if (!filename.endsWith(".json") || filename.includes("..")) {
      return res.status(400).json({ error: "Invalid file type or path" });
    }

    // Determine file path based on whether we're in a nested route or not
    // If filename is in the path (like /api/data/filename.json), go up two levels
    // Otherwise, go up one level for /api/data?filename=...
    const filePath = path.join(__dirname, "..", "public", "data", filename);

    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        return res.status(404).json({ error: "File not found" });
      }
      try {
        res.json(JSON.parse(data));
      } catch (parseErr) {
        res.status(500).json({ error: "Invalid JSON format" });
      }
    });
  } catch (error) {
    console.error("Data fetch error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
