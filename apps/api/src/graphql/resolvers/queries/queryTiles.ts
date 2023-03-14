import { prisma } from '../../../prisma/prismaClient';

export const queryTiles = async (_: any, { gameId }: any) => {
  const tiles = await prisma.tile.findMany({
    where: { gameId },
  });

  return tiles;
};
