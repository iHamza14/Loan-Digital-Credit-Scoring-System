/*
 * Lightweight request validation middleware.
 * Not a full schema-validation library — just enough to catch
 * obvious bad input before it reaches the service layer.
 */

import ApiError from "../utils/ApiError.js";
import { isValidEmail, isValidPhone } from "../utils/helpers.js";

/**
 * Validate signup request body.
 */
export function validateSignup(req, res, next) {
  const { fullName, email, phone, password } = req.body;
  const errors = [];

  if (!fullName || fullName.trim().length < 2) {
    errors.push("Full name is required (min 2 characters)");
  }
  if (!email || !isValidEmail(email)) {
    errors.push("A valid email is required");
  }
  if (!phone || !isValidPhone(phone)) {
    errors.push("A valid 10-digit Indian phone number is required");
  }
  if (!password || password.length < 6) {
    errors.push("Password must be at least 6 characters");
  }

  if (errors.length > 0) {
    return next(ApiError.badRequest("Validation failed", errors));
  }
  next();
}

/**
 * Validate login request body.
 */
export function validateLogin(req, res, next) {
  const { identifier, password } = req.body;
  const errors = [];

  if (!identifier || identifier.trim().length === 0) {
    errors.push("Email or phone is required");
  }
  if (!password || password.length === 0) {
    errors.push("Password is required");
  }

  if (errors.length > 0) {
    return next(ApiError.badRequest("Validation failed", errors));
  }
  next();
}

/**
 * Validate loan application request body.
 */
export function validateLoanApplication(req, res, next) {
  const { amount, purpose, tenure } = req.body;
  const errors = [];

  if (!amount || amount <= 0) {
    errors.push("Loan amount must be a positive number");
  }
  if (!purpose || purpose.trim().length === 0) {
    errors.push("Loan purpose is required");
  }
  if (!tenure || tenure <= 0 || tenure > 360) {
    errors.push("Tenure must be between 1 and 360 months");
  }

  if (errors.length > 0) {
    return next(ApiError.badRequest("Validation failed", errors));
  }
  next();
}
