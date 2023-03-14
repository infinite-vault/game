import { Prisma, PrismaClient } from 'database';
import { prisma } from '../../../prisma/prismaClient';

export const updateEnemy = async (
  enemyId: number,
  data: Prisma.EnemyUncheckedUpdateInput,
  client: PrismaClient | Prisma.TransactionClient = prisma,
) => {
  return await client.enemy.update({
    where: {
      id: enemyId,
    },
    data,
    include: {
      stats: true,
    },
  });
};
