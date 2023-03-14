import { GraphQLError } from 'graphql';
import { prisma } from '../../../prisma/prismaClient';

export const getFight = async (id: number) => {
  const fight = await prisma.fight.findUnique({
    where: {
      id,
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

  if (!fight) {
    throw new GraphQLError('NOT_FOUND');
  }

  return fight;
};
