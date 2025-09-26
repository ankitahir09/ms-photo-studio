// routes/auth.js
import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();


const router = express.Router();

const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD; // ⚠️ should be a bcrypt-hashed string
const JWT_SECRET = process.env.JWT_SECRET;


router.post("/login", (req, res) => {
  const { username, password } = req.body;
  // bcrypt.compareSync will only work if ADMIN_PASSWORD is already hashed
  if (username === ADMIN_USERNAME && bcrypt.compareSync(password, ADMIN_PASSWORD)) {
    const token = jwt.sign(
      { username },
      JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
    );
    return res.json({ token });
  }

  res.status(401).json({ error: "Invalid credentials" });
});

export default router;
