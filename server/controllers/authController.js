/*
 * Auth controller — handles signup, login, and profile requests.
 */

import * as authService from "../services/authService.js";
import { asyncHandler } from "../utils/helpers.js";

export const signup = asyncHandler(async (req, res) => {
  const result = await authService.signup(req.body);

  res.status(201).json({
    success: true,
    message: "Account created successfully",
    data: result,
  });
});

export const login = asyncHandler(async (req, res) => {
  const { identifier, password } = req.body;
  const result = await authService.login(identifier, password);

  res.json({
    success: true,
    message: "Logged in successfully",
    data: result,
  });
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await authService.getProfile(req.user.id);

  res.json({
    success: true,
    data: { user },
  });
});
