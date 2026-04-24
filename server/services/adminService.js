/*
 * Admin service — dashboard stats, application listing,
 * location analytics, and bulk operations.
 */

import prisma from "../lib/prisma.js";

/**
 * Get high-level dashboard numbers.
 */
export async function getDashboardStats() {
  const [total, approved, pending, rejected, disbursed] = await Promise.all([
    prisma.loanApplication.count(),
    prisma.loanApplication.count({ where: { status: "APPROVED" } }),
    prisma.loanApplication.count({ where: { status: "PENDING" } }),
    prisma.loanApplication.count({ where: { status: "REJECTED" } }),
    prisma.loanApplication.count({ where: { status: "DISBURSED" } }),
  ]);

  // total disbursed amount
  const disbursedLoans = await prisma.loanApplication.aggregate({
    where: { status: "DISBURSED" },
    _sum: { amount: true },
  });

  // approved total too
  const approvedLoans = await prisma.loanApplication.aggregate({
    where: { status: "APPROVED" },
    _sum: { amount: true },
  });

  return {
    totalApplications: total,
    approved,
    pending,
    rejected,
    disbursed,
    totalDisbursed: disbursedLoans._sum.amount || 0,
    totalApprovedAmount: approvedLoans._sum.amount || 0,
  };
}

/**
 * Get all loan applications with user info, paginated.
 */
export async function getAllApplications({ page = 1, limit = 20, status, search }) {
  const skip = (page - 1) * limit;

  const where = {};

  if (status) {
    where.status = status.toUpperCase();
  }

  if (search) {
    where.user = {
      OR: [
        { fullName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search } },
      ],
    };
  }

  const [applications, total] = await Promise.all([
    prisma.loanApplication.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            businessType: true,
            address: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.loanApplication.count({ where }),
  ]);

  return {
    applications,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

/**
 * Get risk band distribution across all scored users.
 */
export async function getRiskAnalytics() {
  const scores = await prisma.creditScore.findMany({
    select: { riskBand: true, compositeScore: true },
  });

  // count by risk band
  const bandCounts = {};
  for (const s of scores) {
    bandCounts[s.riskBand] = (bandCounts[s.riskBand] || 0) + 1;
  }

  const total = scores.length || 1;
  const distribution = Object.entries(bandCounts).map(([band, count]) => ({
    name: band,
    value: Math.round((count / total) * 100),
    count,
  }));

  return { distribution, totalScored: scores.length };
}
