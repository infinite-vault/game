import { prisma } from '../../../prisma/prismaClient';

export const addCharacterToExistingGame = async (_: any, { characterId, code }: any) => {
  // TODO: Check first if user has already a character in this group

  const game = await prisma.game.update({
    where: {
      id: code,
    },
    data: {
      characters: {
        connect: {
          id: characterId,
        },
      },
    },
  });

  return game;
};
