import { GraphQLError } from 'graphql';
import { prisma } from '../../../prisma/prismaClient';

export const getTile = async (gameId: string, x: number, y: number) => {
  const tile = await prisma.tile.findUnique({
    where: {
      gameId_x_y: {
        gameId,
        x,
        y,
      },
    },
    include: {
      enemy: true,
    },
  });

  if (!tile) {
    throw new GraphQLError('NOT_FOUND');
  }

  return tile;
};
