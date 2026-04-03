import express from "express";
const router = express.Router();

let rooms;
export const setRoomsReference = (roomsRef) => { rooms = roomsRef; };

router.get("/", (req, res) => {
  const roomList = Object.keys(rooms).map(roomId => ({
    id: roomId,
    players: rooms[roomId].players.map(p => p.username),
    spectators: rooms[roomId].spectators.map(s => s.username)
  }));
  res.json(roomList);
});
export default router;