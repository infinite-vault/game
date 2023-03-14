import { prisma } from '../../../prisma/prismaClient';

export const queryGames = async (_: any, _args: any, { userId }: any) => {
  const characters = await prisma.character.findMany({
    where: {
      userId,
      NOT: {
        gameId: null,
      },
    },
  });

  const games = await prisma.game.findMany({
    where: {
      id: {
        in: characters.map(({ gameId }) => gameId) as string[],
      },
    },
    include: {
      characters: {
        include: {
          user: true,
          stats: true,
        },
      },
    },
  });

  return games;
};
