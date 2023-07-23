import { Request, Response } from 'express';
import { prisma } from '../../../prisma/prismaClient';
import { updateCharacter } from '../../../graphql/resolvers/helpers/updateCharacter';

export const game = async (req: Request, res: Response) => {
  const { gameId } = req.query;

  if (!gameId) {
    res.status(400).json({ error: 'gameId is required' });
  }

  await updateCharacter((req as any).userId, gameId as string, { connection: 'ONLINE' });

  const game = await prisma.game.findUnique({
    where: {
      id: gameId as string,
    },
    include: {
      characters: true,
    },
  });

  res.json(game);
};
