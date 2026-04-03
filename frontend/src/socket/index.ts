import { io, Socket } from "socket.io-client";
import { API_BASE_URL } from "../constants/config";
import type {
  ServerToClientEvents,
  ClientToServerEvents,
} from "../types";

export const socket: Socket<
  ServerToClientEvents,
  ClientToServerEvents
> = io(API_BASE_URL);