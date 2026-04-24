import { PrismaClient } from "@prisma/client";

// singleton pattern — prevents multiple Prisma instances
// during hot reload in development
const globalForPrisma = globalThis;

const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
