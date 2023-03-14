import { Prisma, PrismaClient } from 'database';
import { prisma } from '../../../prisma/prismaClient';
import { pubsub } from '../../../pubsub';
import { PublishKey } from '../../../types/PublishKey';

export const createFight = async (
  gameId: string,
  characterId: number,
  enemyId: number,
  tileId: number,
  publish = true,
  client: PrismaClient | Prisma.TransactionClient = prisma,
) => {
  const fight = await client.fight.create({
    data: {
      game: {
        connect: { id: gameId },
      },
      character: {
        connect: { id: characterId },
      },
      enemy: {
        connect: { id: enemyId },
      },
      tile: {
        connect: { id: tileId },
      },
    },
    include: {
      enemy: {
        include: {
          stats: true,
          tile: true,
        },
      },
    },
  });

  if (publish) {
    pubsub.publish(PublishKey.UPDATE_FIGHT, { updateFight: { ...fight } });
  }

  return fight;
};
