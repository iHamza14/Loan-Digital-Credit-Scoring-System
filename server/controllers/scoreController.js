/*
 * Score controller — get credit score, history, rescore, explanations.
 */

import prisma from "../lib/prisma.js";
import * as scoringService from "../services/scoringService.js";
import { asyncHandler } from "../utils/helpers.js";

/**
 * Get the user's latest credit score.
 */
export const getMyScore = asyncHandler(async (req, res) => {
  const latestScore = await prisma.creditScore.findFirst({
    where: { userId: req.user.id },
    orderBy: { scoredAt: "desc" },
  });

  res.json({
    success: true,
    data: { score: latestScore },
  });
});

/**
 * Get score history over time.
 */
export const getHistory = asyncHandler(async (req, res) => {
  const history = await prisma.creditScore.findMany({
    where: { userId: req.user.id },
    orderBy: { scoredAt: "desc" },
    take: 12, // last 12 scores
    select: {
      compositeScore: true,
      riskBand: true,
      dataCompleteness: true,
      scoredAt: true,
    },
  });

  res.json({
    success: true,
    data: { history },
  });
});

/**
 * Trigger a manual rescore for the current user.
 */
export const rescore = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
  });

  const scoreResult = await scoringService.getScore(user);

  // save the new score
  const creditScore = await prisma.creditScore.create({
    data: {
      userId: req.user.id,
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

  res.json({
    success: true,
    message: "Rescore completed",
    data: { score: creditScore },
  });
});

/**
 * Get SHAP explanation for the user's current profile.
 */
export const getExplanation = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
  });

  const explanation = await scoringService.getExplanation(user);

  res.json({
    success: true,
    data: { explanation },
  });
});
