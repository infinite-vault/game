import { Prisma, PrismaClient } from 'database';
import { prisma } from '../../../prisma/prismaClient';

export const updateCharacter = async (
  userId: string,
  gameId: string,
  data: Prisma.CharacterUncheckedUpdateInput,
  client: PrismaClient | Prisma.TransactionClient = prisma,
) => {
  const character = await client.character.update({
    where: {
      userId_gameId: {
        userId,
        gameId,
      },
    },
    data,
    include: {
      user: true,
      stats: true,
      tile: true,
      action: true,
    },
  });

  return character;
};
