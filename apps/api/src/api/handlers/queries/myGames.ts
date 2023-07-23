import { Request, Response } from 'express';
import { prisma } from '../../../prisma/prismaClient';

export const myGames = async (req: Request, res: Response) => {
  const characters = await prisma.character.findMany({
    where: {
      userId: (req as any).userId,
      NOT: {
        gameId: null,
      },
    },
  });

  const games = await prisma.game.findMany({
    where: {
      id: {
        in: characters.map(({ gameId }: any) => gameId) as string[],
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

  res.json(games);
};
