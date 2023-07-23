import { prisma } from '../../prisma/prismaClient';

export const getTileById = async (tileId: number) => {
  const tile = await prisma.tile.findUnique({
    where: {
      id: tileId,
    },
    include: {
      actions: true,
      characters: true,
    },
  });

  return tile;
};
