import React, { useState, useEffect } from "react";
import { socket } from "../socket";
import { checkWinner } from "../utils/gameUtils";
import type {
  User,
  Player,
  MoveEvent,
  Cell,
  Winner,
  Room,
} from "../types";
import "./Game.css";

interface Props {
  user: User;
  roomId: string;
}

const Game: React.FC<Props> = ({ user, roomId }) => {
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [players, setPlayers] = useState<Player[]>([]);
  const [mySymbol, setMySymbol] = useState<"X" | "O" | null>(null);
  const [turn, setTurn] = useState<"X" | "O">("X");
  const [winner, setWinner] = useState<Winner>(null);

  useEffect(() => {
    socket.emit("joinRoom", {
      roomId,
      userId: user.id,
      username: user.username,
    });

    socket.on("updateRoom", (room: Room) => {
      setPlayers(room.players);
      setBoard(room.board);
      setTurn(room.turn);

      const me = room.players.find((p) => p.userId === user.id);
      setMySymbol(me?.symbol ?? null);
    });

    socket.on("move", (move: MoveEvent) => {
      setBoard((prev) => {
        const updated = [...prev];
        updated[move.index] = move.symbol;

        const result = checkWinner(updated);
        if (result) setWinner(result);

        return updated;
      });

      setTurn((prev) => (prev === "X" ? "O" : "X"));
    });

    return () => {
      socket.off("updateRoom");
      socket.off("move");
    };
  }, [roomId, user]);

  const handleClick = (index: number) => {
    if (!mySymbol || board[index] || winner || turn !== mySymbol) return;

    socket.emit("move", {
      roomId,
      index,
      symbol: mySymbol,
    });
  };

  return (
    <div className="game-container">
      <h2>Room: {roomId}</h2>

      <h3 className="status">
        {winner
          ? winner === "Draw"
            ? "Draw"
            : `${winner} wins`
          : mySymbol
          ? turn === mySymbol
            ? "Your turn"
            : "Opponent's turn"
          : "Spectating"}
      </h3>

      <div className="board">
        {board.map((cell, i) => (
          <button
            key={i}
            className={`cell ${cell ? cell.toLowerCase() : ""}`}
            onClick={() => handleClick(i)}
            disabled={
              !mySymbol ||
              cell !== null ||
              winner !== null ||
              turn !== mySymbol
            }
          >
            {cell}
          </button>
        ))}
      </div>

      <div className="players">
        <h4>Players:</h4>
        <ul>
          {players.map((p) => (
            <li key={p.userId}>
              {p.username} ({p.symbol})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Game;