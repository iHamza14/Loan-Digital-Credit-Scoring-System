/*
 * Loan service — applying for loans, fetching user loans,
 * updating status. Triggers scoring on new applications.
 */

import prisma from "../lib/prisma.js";
import ApiError from "../utils/ApiError.js";
import * as scoringService from "./scoringService.js";

/**
 * Submit a new loan application.
 * Triggers credit scoring and saves the result.
 */
export async function applyForLoan(userId, { amount, purpose, tenure }) {
  // grab the user's profile for scoring
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw ApiError.notFound("User not found");

  // score the applicant
  const scoreResult = await scoringService.getScore(user, { amount });

  // save the credit score snapshot
  const creditScore = await prisma.creditScore.create({
    data: {
      userId,
      compositeScore: scoreResult.compositeScore,
      repaymentScore: scoreResult.repaymentScore,
      incomeScore: scoreResult.incomeScore,
      factors: scoreResult.factors,
      dataCompleteness: scoreResult.dataCompleteness,
      imputedFields: scoreResult.imputedFields,
      riskBand: scoreResult.riskBand,
      improvements: scoreResult.improvements,
    },
  });

  // decide initial status based on risk band
  let status = "PENDING";
  if (scoreResult.suggestedAction === "auto_approved") {
    status = "APPROVED";
  }

  // create the loan application
  const loan = await prisma.loanApplication.create({
    data: {
      userId,
      amount: parseFloat(amount),
      purpose,
      tenure: parseInt(tenure),
      status,
      creditScoreSnapshot: scoreResult.compositeScore,
      riskBand: scoreResult.riskBand,
    },
  });

  return { loan, creditScore };
}

/**
 * Get all loans for a specific user.
 */
export async function getUserLoans(userId) {
  return prisma.loanApplication.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Get a single loan by ID (with ownership check).
 */
export async function getLoanById(loanId, userId) {
  const loan = await prisma.loanApplication.findUnique({
    where: { id: loanId },
  });

  if (!loan) throw ApiError.notFound("Loan not found");
  if (loan.userId !== userId) throw ApiError.forbidden("Not your loan");

  return loan;
}

/**
 * Admin: update a loan's status.
 */
export async function updateLoanStatus(loanId, status, adminNotes) {
  const loan = await prisma.loanApplication.findUnique({
    where: { id: loanId },
  });

  if (!loan) throw ApiError.notFound("Loan not found");

  return prisma.loanApplication.update({
    where: { id: loanId },
    data: {
      status,
      adminNotes: adminNotes || loan.adminNotes,
    },
  });
}
