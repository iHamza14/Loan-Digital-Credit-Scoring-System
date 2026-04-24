/*
 * Axios client — single instance shared by all frontend services.
 *
 * - Attaches JWT to every request
 * - Handles 401 → clears token + redirects to login
 * - Base URL points to our Express backend
 */

import axios from "axios";

const client = axios.create({
  baseURL: "http://localhost:5000/api",
  timeout: 20000,
  headers: { "Content-Type": "application/json" },
});

// ── request interceptor: attach token ─────────────────────────
client.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── response interceptor: handle auth errors ──────────────────
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // redirect to login only if not already there
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default client;
