/*
 * JWT authentication + role-based access middleware.
 */

import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";
import ApiError from "../utils/ApiError.js";

/**
 * Verify the JWT from the Authorization header and attach
 * the user object to req.user.
 */
export async function authenticate(req, res, next) {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      throw ApiError.unauthorized("No token provided");
    }

    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        role: true,
        kycStatus: true,
      },
    });

    if (!user) {
      throw ApiError.unauthorized("User no longer exists");
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
      return next(ApiError.unauthorized("Invalid or expired token"));
    }
    next(err);
  }
}

/**
 * Check that the authenticated user has the ADMIN role.
 * Must be used after authenticate().
 */
export function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== "ADMIN") {
    return next(ApiError.forbidden("Admin access required"));
  }
  next();
}
