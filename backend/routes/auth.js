const express = require("express");
const bcrypt = require("bcrypt");
const { createUser, getUserByUsername } = require("../models/userModel");

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  const exists = await getUserByUsername(username);
  if (exists) {
    return res.json({ success: false, message: "Username exists" });
  }

  const id = await createUser(username, password);
  res.json({ success: true, id, username });
});

router.post("/signin", async (req, res) => {
  const { username, password } = req.body;

  const user = await getUserByUsername(username);
  if (!user) {
    return res.json({ success: false, message: "User not found" });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return res.json({ success: false, message: "Wrong password" });
  }

  res.json({ success: true, id: user.id, username });
});

module.exports = router;