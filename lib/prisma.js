import { PrismaClient } from '@prisma/client';

const globalForPrisma = global;

function getPrismaClient() {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient({
      log: ['query', 'error', 'warn'],
    });
  }
  return globalForPrisma.prisma;
}

if (process.env.NODE_ENV !== 'production') {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = getPrismaClient();
  }
}

export const prisma = globalForPrisma.prisma || getPrismaClient();