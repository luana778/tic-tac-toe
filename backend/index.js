// server/index.js
const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const { createUser, getUserByUsername, saveGameResult } = require("./models");
const bcrypt = require("bcrypt");

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// In-memory rooms structure
const rooms = {};

/**
 * REST API - Signup
 */
app.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  try {
    const exists = await getUserByUsername(username);
    if (exists) return res.json({ success: false, message: "Username exists" });
    const id = await createUser(username, password);
    res.json({ success: true, id, username });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.post("/signin", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await getUserByUsername(username);
    if (!user) return res.json({ success: false, message: "User not found" });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.json({ success: false, message: "Wrong password" });
    res.json({ success: true, id: user.id, username: user.username });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/**
 * REST API - Get list of rooms
 */
app.get("/rooms", (req, res) => {
  res.json(Object.values(rooms));
});

/**
 * Socket.IO - Real-time multiplayer
 */
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  /**
   * Join a room
   */
  socket.on("joinRoom", ({ roomId, userId, username }) => {
    if (!rooms[roomId]) {
      rooms[roomId] = {
        id: roomId,
        players: [],
        spectators: [],
        board: Array(9).fill(null),
        turn: "X",
        gameOver: false,
        winner: null
      };
    }

    const room = rooms[roomId];

    // Assign symbol to player if less than 2 players
    if (room.players.length < 2) {
      const symbol = room.players.length === 0 ? "X" : "O";
      room.players.push({ socketId: socket.id, userId, username, symbol });
    } else {
      // Spectator
      room.spectators.push({ socketId: socket.id, userId, username });
    }

    socket.join(roomId);
    io.to(roomId).emit("updateRoom", room);
  });

  /**
   * Relay moves
   */
  socket.on("move", ({ roomId, index, symbol }) => {
    socket.to(roomId).emit("move", { index, symbol });
  });

  /**
   * Relay reset
   */
  socket.on("resetGame", ({ roomId }) => {
    socket.to(roomId).emit("resetGame");
  });

  /**
   * Save game results to database
   */
  socket.on("gameResult", async ({ playerX, playerO, winner }) => {
    await saveGameResult(playerX, playerO, winner);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    // Optional: remove player from rooms
  });
});

server.listen(5137, () => console.log("Server running on port 5137"));