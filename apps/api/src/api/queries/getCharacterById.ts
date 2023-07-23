import { prisma } from '../../prisma/prismaClient';

export const getCharacterById = async (id: number) => {
  const character = await prisma.character.findUnique({
    where: {
      id,
    },
    include: {
      action: true,
      stats: true,
      tile: true,
    },
  });

  return character;
};
