/*
 * Global error handler — catches anything thrown or passed to next().
 * Returns a consistent JSON shape so the frontend can rely on it.
 */

import ApiError from "../utils/ApiError.js";

export default function errorHandler(err, req, res, _next) {
  // log the full error in dev
  if (process.env.NODE_ENV !== "production") {
    console.error("Error:", err);
  }

  // if it's our custom error, use its status
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
    });
  }

  // Prisma-specific errors
  if (err.code === "P2002") {
    const field = err.meta?.target?.[0] || "field";
    return res.status(409).json({
      success: false,
      message: `A record with that ${field} already exists`,
    });
  }

  if (err.code === "P2025") {
    return res.status(404).json({
      success: false,
      message: "Record not found",
    });
  }

  // fallback
  return res.status(500).json({
    success: false,
    message: "Something went wrong",
  });
}
