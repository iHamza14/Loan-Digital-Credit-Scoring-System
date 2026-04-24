/*
 * Loan API calls — apply, list, get details.
 */

import client from "../api/client";

export async function applyForLoan(data) {
  const res = await client.post("/loans/apply", data);
  return res.data.data; // { loan, creditScore }
}

export async function getMyLoans() {
  const res = await client.get("/loans/my-loans");
  return res.data.data; // { loans }
}

export async function getLoanById(id) {
  const res = await client.get(`/loans/${id}`);
  return res.data.data; // { loan }
}
