import { PrismaClient } from 'database';

export const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});
