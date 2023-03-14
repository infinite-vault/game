import { prisma } from '../../../prisma/prismaClient';

export const addCharacterToNewGame = async (_: any, { characterId, name }: any) => {
  const game = await prisma.game.create({
    data: {
      name,
      characters: {
        connect: {
          id: characterId,
        },
      },
      tiles: {
        create: {
          x: 0,
          y: 0,
        },
      },
    },
  });

  return game;
};
