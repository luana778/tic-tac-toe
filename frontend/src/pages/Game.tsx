// client/src/pages/Game.tsx
import React, { useState, useEffect } from "react";
import { socket } from "../socket";
import type { User, Player, MoveEvent } from "../types";
import "./Game.css";

interface Props {
  user: User;
  roomId: string;
}

const Game: React.FC<Props> = ({ user, roomId }) => {
  const [board, setBoard] = useState<(null | "X" | "O")[]>(Array(9).fill(null));
  const [players, setPlayers] = useState<Player[]>([]);
  const [spectators, setSpectators] = useState<Player[]>([]);
  const [mySymbol, setMySymbol] = useState<"X" | "O" | null>(null);
  const [turn, setTurn] = useState<"X" | "O">("X");
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<"X" | "O" | "Draw" | null>(null);

  const checkWinner = (b: (null | "X" | "O")[]): "X" | "O" | null => {
    console.log(b);
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    for (let [a, b1, c] of lines) if (b[a] && b[a] === b[b1] && b[a] === b[c]) return b[a];
    return null;
  };

  useEffect(() => {
    // Join room
    socket.emit("joinRoom", { roomId, userId: user.id, username: user.username });

    // Update room state
    socket.on("updateRoom", (room: any) => {
      setPlayers(room.players);
      setSpectators(room.spectators || []);
      setBoard(room.board);
      setTurn(room.turn);
      setGameOver(room.gameOver);
      setWinner(room.winner);

      const me = room.players.find((p: any) => p.userId === user.id);
      setMySymbol(me ? me.symbol : null);
    });

    // Apply move
    socket.on("move", ({ index, symbol }: MoveEvent) => {
      setBoard(prev => {
        const b = [...prev];
        b[index] = symbol;

        const win = checkWinner(b);
        if (win || !b.includes(null)) {
          setGameOver(true);
          setWinner(win || "Draw");
          socket.emit("gameResult", {
            playerX: players.find(p => p.symbol === "X")?.userId,
            playerO: players.find(p => p.symbol === "O")?.userId,
            winner: win ? user.id : null
          });
        }
        return b;
      });
      setTurn(prev => (prev === "X" ? "O" : "X"));
    });

    // Reset game
    socket.on("resetGame", () => {
      setBoard(Array(9).fill(null));
      setTurn("X");
      setGameOver(false);
      setWinner(null);
    });

    return () => {
      socket.off("updateRoom");
      socket.off("move");
      socket.off("resetGame");
    };
  }, [roomId, user.id]);

  const isSpectator = !players.some(p => p.userId === user.id);

  const handleClick = (i: number) => {
    if (board[i] || gameOver || turn !== mySymbol || isSpectator) return;

    const newBoard = [...board];
    newBoard[i] = mySymbol!;
    setBoard(newBoard);

    const win = checkWinner(newBoard);
    if (win || !newBoard.includes(null)) {
      setGameOver(true);
      setWinner(win || "Draw");
      socket.emit("gameResult", {
        playerX: players.find(p => p.symbol === "X")?.userId,
        playerO: players.find(p => p.symbol === "O")?.userId,
        winner: win ? user.id : null
      });
    }

    socket.emit("move", { roomId, index: i, symbol: mySymbol! });
    setTurn(mySymbol === "X" ? "O" : "X");
  };

  const handleReset = () => socket.emit("resetGame", { roomId });

  return (
    <div className="game-container">
    <h2>Room: {roomId}</h2>
    <h3 className="status">
      {isSpectator ? "Spectator Mode" : `You are ${mySymbol} | Turn: ${turn}`}
    </h3>
  
    <div className="board">
      {board.map((cell, i) => (
        <button
          key={i}
          onClick={() => handleClick(i)}
          disabled={cell || gameOver || turn !== mySymbol || isSpectator}
          className={`cell ${cell ? cell.toLowerCase() : ""}`}
        >
          {cell}
        </button>
      ))}
    </div>
  
    {gameOver && (
      <h3 className={`winner ${winner === "Draw" ? "draw" : winner === mySymbol ? "" : "loser"}`}>
        {winner === "Draw" ? "Draw" : winner === mySymbol ? "You won!" : "You lost!"}
      </h3>
    )}
  
    <button className="reset-btn" onClick={handleReset}>
      Reset Game
    </button>
  
    <div className="players">
      <h4>Players:</h4>
      <ul>{players.map(p => <li key={p.userId}>{p.username} ({p.symbol})</li>)}</ul>
    </div>
  
    <div className="spectators">
      <h4>Spectators:</h4>
      <ul>{spectators.map(s => <li key={s.userId}>{s.username}</li>)}</ul>
    </div>
  </div>
  );
};

export default Game;