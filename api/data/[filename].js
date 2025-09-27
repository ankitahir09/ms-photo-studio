import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const fileName = req.query.filename;

    // Prevent path traversal
    if (!fileName.endsWith(".json") || fileName.includes("..")) {
      return res.status(400).json({ error: "Invalid file type or path" });
    }

    const filePath = path.join(__dirname, "..", "..", "public", "data", fileName);

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
    console.error('Data fetch error:', error);
    res.status(500).json({ error: "Internal server error" });
  }
}
