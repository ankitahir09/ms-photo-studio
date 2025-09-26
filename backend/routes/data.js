// routes/data.js
import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const router = express.Router();

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve any JSON file from /public/data
router.get("/:filename", (req, res) => {
  const fileName = req.params.filename;

  // Prevent path traversal
  if (!fileName.endsWith(".json") || fileName.includes("..")) {
    return res.status(400).json({ error: "Invalid file type or path" });
  }

  const filePath = path.join(__dirname, "..", "..", "frontend", "public", "data", fileName);

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
});

export default router;
