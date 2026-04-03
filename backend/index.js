// server/index.js
const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const { createUser, getUserByUsername, saveGameResult } = require("./models/models");
const bcrypt = require("bcrypt");

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const rooms = {};

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

app.get("/rooms", (req, res) => {
  res.json(Object.values(rooms));
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

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

    if (room.players.length < 2) {
      const symbol = room.players.length === 0 ? "X" : "O";
      room.players.push({ socketId: socket.id, userId, username, symbol });
    } else {
      room.spectators.push({ socketId: socket.id, userId, username });
    }

    socket.join(roomId);
    io.to(roomId).emit("updateRoom", room);
  });

  socket.on("move", ({ roomId, index, symbol }) => {
    socket.to(roomId).emit("move", { index, symbol });
  });


  socket.on("resetGame", ({ roomId }) => {
    socket.to(roomId).emit("resetGame");
  });


  socket.on("gameResult", async ({ playerX, playerO, winner }) => {
    await saveGameResult(playerX, playerO, winner);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(5137, () => console.log("Server running on port 5137"));