import React, { useEffect, useState } from "react";
import { getRooms } from "../services/roomApi";
import type { Room } from "../types";
import "./RoomList.css";

interface Props {
  onJoin: (roomId: string) => void;
}

const RoomList: React.FC<Props> = ({ onJoin }) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomId, setRoomId] = useState("");

  useEffect(() => {
    const fetch = async () => {
      const { data } = await getRooms();
      setRooms(data);
    };

    fetch();
    const interval = setInterval(fetch, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="room-container">
      <h2>Rooms</h2>

      <ul>
        {rooms.map((r) => (
          <li key={r.id}>
            {r.id} ({r.players.length}/2)
            <button onClick={() => onJoin(r.id)}>Join</button>
          </li>
        ))}
      </ul>

      <h3>Create Room</h3>

      <input
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        placeholder="Room ID"
      />

      <button onClick={() => onJoin(roomId)}>Create</button>
    </div>
  );
};

export default RoomList;