import { prisma } from '../../../prisma/prismaClient';

export const addCharacterToExistingGame = async (_: any, { characterId, code }: any) => {
  // TODO: Check first if USER has already a character in this group
  // is only one character per USER allowed?

  return await prisma.$transaction(async (tx) => {
    const game = await tx.game.update({
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

    await tx.character.update({
      where: {
        id: characterId,
      },
      data: {
        game: {
          connect: {
            id: game.id,
          },
        },
        tile: {
          connect: {
            gameId_x_y: {
              gameId: game.id,
              x: 0,
              y: 0,
            },
          },
        },
      },
    });

    return game;
  });
};
