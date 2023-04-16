import { prisma } from '../../../prisma/prismaClient';

export const queryTiles = async (_: any, { gameId }: any) => {
  const tiles = await prisma.tile.findMany({
    where: { gameId },
  });

  await new Promise((resolve) => setTimeout(resolve, 4000));

  return tiles;
};
