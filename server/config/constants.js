/*
 * App-wide constants — risk bands, scoring thresholds, and config.
 * Keep magic numbers here so nobody scatters them across files.
 */

export const RISK_BANDS = [
  { min: 750, max: 900, label: "Low Risk - High Need", action: "auto_approved" },
  { min: 650, max: 749, label: "Medium Risk - High Need", action: "manual_review" },
  { min: 500, max: 649, label: "High Risk - High Need", action: "referred" },
  { min: 300, max: 499, label: "Very High Risk", action: "rejected" },
];

export const LOAN_PURPOSES = [
  "business-expansion",
  "working-capital",
  "equipment-purchase",
  "inventory",
  "other",
];

export const MAX_LOAN_AMOUNT = 500000; // ₹5L
export const MIN_LOAN_AMOUNT = 5000;   // ₹5K

export const JWT_EXPIRY = "7d";

export const SCORING_ENGINE_URL =
  process.env.SCORING_ENGINE_URL || "http://localhost:8000";
