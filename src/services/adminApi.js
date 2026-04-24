/*
 * Admin API calls — dashboard, applications, status update, analytics.
 */

import client from "../api/client";

export async function getDashboard() {
  const res = await client.get("/admin/dashboard");
  return res.data.data; // { stats }
}

export async function getApplications({ page = 1, limit = 20, status, search } = {}) {
  const params = { page, limit };
  if (status) params.status = status;
  if (search) params.search = search;

  const res = await client.get("/admin/applications", { params });
  return res.data.data; // { applications, pagination }
}

export async function updateApplicationStatus(id, status, adminNotes = "") {
  const res = await client.put(`/admin/applications/${id}/status`, { status, adminNotes });
  return res.data.data; // { loan }
}

export async function getAnalytics() {
  const res = await client.get("/admin/analytics");
  return res.data.data; // { analytics }
}
