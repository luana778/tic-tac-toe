// client/src/types.ts

export interface User {
  id: number;
  username: string;
}

export interface Player {
  userId: number;
  username: string;
  symbol: "X" | "O";
  socketId?: string;
}

export interface MoveEvent {
  index: number;
  symbol: "X" | "O";
}