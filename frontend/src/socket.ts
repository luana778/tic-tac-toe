// client/src/socket.ts
import { io } from "socket.io-client";

// Connect to backend
export const socket = io("http://192.168.137.28:5137");