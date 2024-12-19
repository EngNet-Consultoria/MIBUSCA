import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient({
  errorFormat: "minimal",
  log: process.env.NODE_ENV === "development" ? ["query", "info", "warn", "error"] : ["warn"],
});
