import express from "express";
import bcrypt from "bcrypt";
import { db } from "../config/db.js";

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      "INSERT INTO users (username, password) VALUES (?, ?)",
      [username, hashedPassword]
    );
    res.json({ success: true, id: result.insertId, username });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, message: "Username already successful" });
  }
});

router.post("/signin", async (req, res) => {
  const { username, password } = req.body;
  try {
    const [rows] = await db.query("SELECT * FROM users WHERE username = ?", [username]);
    const user = rows[0];
    if (!user) return res.status(400).json({ success: false, message: "Username not found" });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ success: false, message: "Wrong password" });
    res.json({ success: true, id: user.id, username: user.username });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;