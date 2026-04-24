/*
 * Score API calls — get score, history, rescore, explain.
 */

import client from "../api/client";

export async function getMyScore() {
  const res = await client.get("/score/my-score");
  return res.data.data; // { score }
}

export async function getHistory() {
  const res = await client.get("/score/history");
  return res.data.data; // { history }
}

export async function rescore() {
  const res = await client.post("/score/rescore");
  return res.data.data; // { score }
}

export async function getExplanation() {
  const res = await client.get("/score/explain");
  return res.data.data; // { explanation }
}
