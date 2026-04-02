// client/src/pages/RoomList.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";

interface Room {
  id: string;
  players: any[];
  spectators: any[];
}

interface Props {
  onJoin: (roomId: string) => void;
}

const RoomList: React.FC<Props> = ({ onJoin }) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [newRoomId, setNewRoomId] = useState("");

  const fetchRooms = async () => {
    const res = await axios.get("http://192.168.137.28:5137/rooms");
    setRooms(res.data);
  };

  useEffect(() => {
    fetchRooms();
    const interval = setInterval(fetchRooms, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Rooms</h2>
      <ul>
        {rooms.map(r => (
          <li key={r.id}>
            {r.id} ({r.players.length}/2)
            <button onClick={() => onJoin(r.id)}>Join</button>
          </li>
        ))}
      </ul>

      <h3>Create Room</h3>
      <input placeholder="Room ID" value={newRoomId} onChange={e => setNewRoomId(e.target.value)} />
      <button onClick={() => onJoin(newRoomId)}>Create & Join</button>
    </div>
  );
};

export default RoomList;