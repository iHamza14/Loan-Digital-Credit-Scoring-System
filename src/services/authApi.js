/*
 * Auth API calls — signup, login, get current user.
 */

import client from "../api/client";

export async function signup(data) {
  const res = await client.post("/auth/signup", data);
  return res.data.data; // { user, token }
}

export async function login(identifier, password) {
  const res = await client.post("/auth/login", { identifier, password });
  return res.data.data; // { user, token }
}

export async function getMe() {
  const res = await client.get("/auth/me");
  return res.data.data; // { user }
}
