import { Prisma, PrismaClient } from 'database';
import { prisma } from '../../../prisma/prismaClient';
import { pubsub } from '../../../pubsub';
import { PublishKey } from '../../../types/PublishKey';

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
