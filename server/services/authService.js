/*
 * Auth service — signup, login, token generation.
 * Talks to Prisma for user CRUD and bcrypt for passwords.
 */

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";
import ApiError from "../utils/ApiError.js";
import { JWT_EXPIRY } from "../config/constants.js";

/**
 * Create a new user account.
 */
export async function signup({ fullName, email, phone, password, age, address, businessType, monthlyIncome }) {
  // check if email or phone already taken
  const existing = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { phone }],
    },
  });

  if (existing) {
    const field = existing.email === email ? "email" : "phone";
    throw ApiError.badRequest(`A user with that ${field} already exists`);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      fullName,
      email: email.toLowerCase(),
      phone,
      password: hashedPassword,
      age: age ? parseInt(age) : null,
      address: address || null,
      businessType: businessType || null,
      monthlyIncome: monthlyIncome ? parseFloat(monthlyIncome) : null,
    },
  });

  const token = generateToken(user.id);

  return {
    user: sanitiseUser(user),
    token,
  };
}

/**
 * Log in with email/phone + password.
 */
export async function login(identifier, password) {
  // try finding by email first, then phone
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { email: identifier.toLowerCase() },
        { phone: identifier },
      ],
    },
  });

  if (!user) {
    throw ApiError.unauthorized("Invalid credentials");
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    throw ApiError.unauthorized("Invalid credentials");
  }

  const token = generateToken(user.id);

  return {
    user: sanitiseUser(user),
    token,
  };
}

/**
 * Get the current user's profile.
 */
export async function getProfile(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw ApiError.notFound("User not found");
  }

  return sanitiseUser(user);
}

/**
 * Sign a JWT with the user's ID.
 */
function generateToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: JWT_EXPIRY,
  });
}

/**
 * Strip sensitive fields before sending user data to the client.
 */
function sanitiseUser(user) {
  const { password, ...safe } = user;
  return safe;
}
