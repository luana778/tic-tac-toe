export interface User {
    id: string;
    username: string;
  }
  
  export interface Player {
    userId: string;
    username: string;
    symbol: "X" | "O";
  }
  
  export type Cell = "X" | "O" | null;
  export type Winner = "X" | "O" | "Draw" | null;
  
  export interface MoveEvent {
    index: number;
    symbol: "X" | "O";
  }
  
  export interface Room {
    id: string;
    players: Player[];
    spectators: Player[];
    board: Cell[];
    turn: "X" | "O";
    gameOver?: boolean;
    winner?: Winner;
  }
  
  /* ✅ SOCKET TYPES */
  
  // Server → Client
  export interface ServerToClientEvents {
    updateRoom: (room: Room) => void;
    move: (data: MoveEvent) => void;
  }
  
  // Client → Server
  export interface ClientToServerEvents {
    joinRoom: (data: {
      roomId: string;
      userId: string;
      username: string;
    }) => void;
  
    move: (data: {
      roomId: string;
      index: number;
      symbol: "X" | "O";
    }) => void;
  
    resetGame: (data: { roomId: string }) => void;
  }