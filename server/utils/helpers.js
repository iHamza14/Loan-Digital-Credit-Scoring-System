/*
 * Shared helper functions used across the backend.
 */

/**
 * Wrap an async route handler so thrown errors reach the error middleware.
 * Avoids writing try/catch in every controller.
 */
export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/**
 * Pick specific keys from an object — handy for sanitising
 * user input or building API responses.
 */
export function pick(obj, keys) {
  const result = {};
  for (const key of keys) {
    if (obj[key] !== undefined) {
      result[key] = obj[key];
    }
  }
  return result;
}

/**
 * Quick phone number validation (Indian 10-digit).
 */
export function isValidPhone(phone) {
  return /^[6-9]\d{9}$/.test(phone);
}

/**
 * Quick email validation.
 */
export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
