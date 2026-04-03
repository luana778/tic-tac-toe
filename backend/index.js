const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const authRoutes = require("./routes/auth");
const roomRoutes = require("./routes/rooms");
const setupSocket = require("./socket");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/", authRoutes);
app.use("/", roomRoutes);

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});

setupSocket(io);

server.listen(5137, () => {
  console.log("Server running on port 5137");
});