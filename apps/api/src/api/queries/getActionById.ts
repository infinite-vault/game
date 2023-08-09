import { prisma } from '../../prisma/prismaClient';

export const getActionById = async (id: number) => {
  const tile = await prisma.action.findUnique({
    where: {
      id,
    },
    include: {
      characters: {
        include: {
          stats: true,
          loot: true,
        },
      },
      tile: true,
    },
  });

  return tile;
};
