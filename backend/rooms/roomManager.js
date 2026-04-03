const rooms = {};

const createRoom = (roomId) => {
  if (!rooms[roomId]) {
    rooms[roomId] = {
      id: roomId,
      players: [],
      spectators: [],
      board: Array(9).fill(null),
      turn: "X",
      winner: null,
      gameOver: false,
    };
  }
  return rooms[roomId];
};

const joinRoom = (room, socket, userId, username) => {
  if (room.players.length < 2) {
    const symbol = room.players.length === 0 ? "X" : "O";

    room.players.push({
      socketId: socket.id,
      userId,
      username,
      symbol,
    });
  } else {
    room.spectators.push({
      socketId: socket.id,
      userId,
      username,
    });
  }
};

const makeMove = (room, index, symbol) => {
  if (room.board[index] || room.turn !== symbol) return false;

  room.board[index] = symbol;
  room.turn = symbol === "X" ? "O" : "X";

  return true;
};

module.exports = { rooms, createRoom, joinRoom, makeMove };