import { api } from "./api";

export const signIn = (username: string, password: string) =>
  api.post("/signin", { username, password });

export const signUp = (username: string, password: string) =>
  api.post("/signup", { username, password });
console.log("API BASE URL:", api.defaults.baseURL);