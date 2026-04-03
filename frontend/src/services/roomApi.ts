import { api } from "./api";
import type { Room } from "../types";

export const getRooms = () => api.get<Room[]>("/rooms");