import { prisma } from '../../prisma/prismaClient';

export const getCharacter = async (userId: string, gameId: string) => {
  const character = await prisma.character.findUnique({
    where: {
      userId_gameId: {
        userId,
        gameId,
      },
    },
    include: {
      action: true,
      stats: true,
      tile: true,
    },
  });

  return character;
};
