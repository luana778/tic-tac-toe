const express = require("express");
const { rooms } = require("../rooms/roomManager");

const router = express.Router();

router.get("/rooms", (req, res) => {
  res.json(Object.values(rooms)); // ✅ FULL ROOM OBJECT
});

module.exports = router;