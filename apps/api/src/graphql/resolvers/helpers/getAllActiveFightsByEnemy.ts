import { GraphQLError } from 'graphql';
import { prisma } from '../../../prisma/prismaClient';

export const getAllActiveFightsByEnemy = async (enemyId: number) => {
  const fights = await prisma.fight.findMany({
    where: {
      enemyId,
      isOver: false,
    },
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

  if (!fights) {
    throw new GraphQLError('NOT_FOUND');
  }

  return fights;
};
