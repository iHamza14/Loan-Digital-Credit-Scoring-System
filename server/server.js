/*
 * LoanSewa API — Express server entry point.
 *
 * Start with: npm run dev
 * Runs on PORT from .env (default 5000)
 */

import "dotenv/config";
import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import loanRoutes from "./routes/loanRoutes.js";
import scoreRoutes from "./routes/scoreRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import errorHandler from "./middlewares/errorHandler.js";
import * as scoringService from "./services/scoringService.js";

const app = express();
const PORT = process.env.PORT || 5000;

// ── global middleware ──────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── routes ─────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/loans", loanRoutes);
app.use("/api/score", scoreRoutes);
app.use("/api/admin", adminRoutes);

// health check
app.get("/api/health", async (_req, res) => {
  const scoringHealth = await scoringService.checkHealth();
  res.json({
    status: "healthy",
    scoringEngine: scoringHealth,
    timestamp: new Date().toISOString(),
  });
});

// 404 for unmatched routes
app.use((_req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// ── error handler (must be last) ──────────────────────────────
app.use(errorHandler);

// ── start ─────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n  🏦  LoanSewa API running on http://localhost:${PORT}`);
  console.log(`  📊  Scoring engine expected at ${process.env.SCORING_ENGINE_URL || "http://localhost:8000"}\n`);
});
