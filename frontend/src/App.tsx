// client/src/App.tsx
import React, { useState } from "react";
import Auth from "./pages/Auth";
import RoomList from "./pages/RoomList";
import Game from "./pages/Game";
import type { User } from "./types";

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);

  if (!user) return <Auth onLogin={setUser} />;
  if (!roomId) return <RoomList onJoin={setRoomId} />;
  return <Game user={user} roomId={roomId} />;
};

export default App;