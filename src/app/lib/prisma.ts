import { PrismaClient } from "@prisma/client";

// Extend the global object to include `prisma` for TypeScript safety
const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

// Create a single instance of PrismaClient (singleton pattern)
const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: ["info", "warn", "error"], // Enable logging for debugging
});

// Prevent creating multiple instances in development
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
