const {
  createRoom,
  joinRoom,
  makeMove,
} = require("../rooms/roomManager");

/* ✅ Winner logic (server-side) */
const checkWinner = (board) => {
  const lines = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6],
  ];

  for (const [a,b,c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }

  return board.includes(null) ? null : "Draw";
};

const setupSocket = (io) => {
  io.on("connection", (socket) => {

    /* JOIN ROOM */
    socket.on("joinRoom", ({ roomId, userId, username }) => {
      const room = createRoom(roomId);

      joinRoom(room, socket, userId, username);
      socket.join(roomId);

      io.to(roomId).emit("updateRoom", room);
    });

    /* MAKE MOVE */
    socket.on("move", ({ roomId, index, symbol }) => {
      const room = createRoom(roomId);

      /* ❌ Block if game finished */
      if (room.gameOver) return;

      /* ❌ Block wrong turn */
      if (room.turn !== symbol) return;

      const success = makeMove(room, index, symbol);
      if (!success) return;

      /* ✅ Check winner */
      const result = checkWinner(room.board);

      if (result) {
        room.winner = result;
        room.gameOver = true;
      }

      /* 🔥 Sync everything */
      io.to(roomId).emit("move", { index, symbol });
      io.to(roomId).emit("updateRoom", room);
    });

    /* RESET GAME */
    socket.on("resetGame", ({ roomId }) => {
      const room = createRoom(roomId);

      room.board = Array(9).fill(null);
      room.turn = "X";
      room.winner = null;
      room.gameOver = false;

      io.to(roomId).emit("updateRoom", room);
    });

  });
};

module.exports = setupSocket;