/*
 * Scoring service — bridge between Node.js and the Python scoring engine.
 * All communication goes through HTTP (axios).
 */

import axios from "axios";
import { SCORING_ENGINE_URL } from "../config/constants.js";

const client = axios.create({
  baseURL: SCORING_ENGINE_URL,
  timeout: 15000, // scoring can take a few seconds
  headers: { "Content-Type": "application/json" },
});

/**
 * Build the payload the Python engine expects from a user + their loan data.
 */
function buildApplicantPayload(user, loanData = {}) {
  return {
    monthly_income: user.monthlyIncome || null,
    business_months: null, // could be tracked in user profile later
    electricity_bill_avg: null,
    mobile_recharge_avg: null,
    monthly_expenses: null,
    age: user.age || null,
    loan_amount: loanData.amount || null,

    // repayment data — pulled from past loans in the future
    // for now, sent as null so imputation kicks in
    on_time_payments: null,
    total_payments: null,
    defaults: null,
    outstanding_debt: null,
    credit_limit: null,
    total_debt: null,
    delayed_payments: null,
  };
}

/**
 * Score an applicant by calling the Python engine.
 */
export async function getScore(user, loanData = {}) {
  const payload = buildApplicantPayload(user, loanData);

  try {
    const { data } = await client.post("/score", payload);
    return data;
  } catch (err) {
    console.error("Scoring engine error:", err.message);

    // return a fallback score so the app doesn't break
    // if the Python service is down
    return {
      compositeScore: 600,
      repaymentScore: 60,
      incomeScore: 60,
      riskBand: "Medium Risk - High Need",
      suggestedAction: "manual_review",
      dataCompleteness: 0,
      factors: [],
      imputedFields: [],
      improvements: ["Scoring service is temporarily unavailable. Score is estimated."],
      rawProbability: 0.5,
    };
  }
}

/**
 * Get SHAP explanation for an applicant.
 */
export async function getExplanation(user) {
  const payload = buildApplicantPayload(user);

  try {
    const { data } = await client.post("/explain", payload);
    return data;
  } catch (err) {
    console.error("Explanation engine error:", err.message);
    return {
      shapValues: [],
      baseValue: 0.5,
      biasFlags: [],
    };
  }
}

/**
 * Check if the Python scoring engine is running.
 */
export async function checkHealth() {
  try {
    const { data } = await client.get("/health");
    return data;
  } catch {
    return { status: "unreachable", modelLoaded: false };
  }
}
