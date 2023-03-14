import { Prisma, PrismaClient } from 'database';
import { prisma } from '../../../prisma/prismaClient';
import { pubsub } from '../../../pubsub';
import { PublishKey } from '../../../types/PublishKey';

export const updateFight = async (
  fightId: number,
  data:
    | (Prisma.Without<Prisma.FightUpdateInput, Prisma.FightUncheckedUpdateInput> & Prisma.FightUncheckedUpdateInput)
    | (Prisma.Without<Prisma.FightUncheckedUpdateInput, Prisma.FightUpdateInput> & Prisma.FightUpdateInput),
  publish = true,
  client: PrismaClient | Prisma.TransactionClient = prisma,
) => {
  const fight = await client.fight.update({
    where: {
      id: fightId,
    },
    data,
    include: {
      character: {
        include: {
          stats: true,
        },
      },
      enemy: {
        include: {
          stats: true,
        },
      },
      tile: true,
    },
  });

  if (publish) {
    pubsub.publish(PublishKey.UPDATE_FIGHT, { updateFight: { ...fight } });
  }

  return fight;
};
