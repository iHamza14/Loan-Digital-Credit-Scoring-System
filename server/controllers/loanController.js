/*
 * Loan controller — apply for loan, list user's loans, get details.
 */

import * as loanService from "../services/loanService.js";
import { asyncHandler } from "../utils/helpers.js";

export const apply = asyncHandler(async (req, res) => {
  const result = await loanService.applyForLoan(req.user.id, req.body);

  res.status(201).json({
    success: true,
    message: "Loan application submitted",
    data: result,
  });
});

export const getMyLoans = asyncHandler(async (req, res) => {
  const loans = await loanService.getUserLoans(req.user.id);

  res.json({
    success: true,
    data: { loans },
  });
});

export const getLoanById = asyncHandler(async (req, res) => {
  const loan = await loanService.getLoanById(req.params.id, req.user.id);

  res.json({
    success: true,
    data: { loan },
  });
});
