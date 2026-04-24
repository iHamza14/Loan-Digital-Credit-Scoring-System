/*
 * Admin controller — dashboard stats, application management, analytics.
 */

import * as adminService from "../services/adminService.js";
import * as loanService from "../services/loanService.js";
import { asyncHandler } from "../utils/helpers.js";

export const getDashboard = asyncHandler(async (req, res) => {
  const stats = await adminService.getDashboardStats();

  res.json({
    success: true,
    data: { stats },
  });
});

export const getApplications = asyncHandler(async (req, res) => {
  const { page, limit, status, search } = req.query;

  const result = await adminService.getAllApplications({
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 20,
    status,
    search,
  });

  res.json({
    success: true,
    data: result,
  });
});

export const updateStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, adminNotes } = req.body;

  const loan = await loanService.updateLoanStatus(id, status, adminNotes);

  res.json({
    success: true,
    message: `Loan status updated to ${status}`,
    data: { loan },
  });
});

export const getAnalytics = asyncHandler(async (req, res) => {
  const analytics = await adminService.getRiskAnalytics();

  res.json({
    success: true,
    data: { analytics },
  });
});
