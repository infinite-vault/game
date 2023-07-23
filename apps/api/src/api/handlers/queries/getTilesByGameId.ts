import { Request, Response } from 'express';
import { prisma } from '../../../prisma/prismaClient';

export const getTilesByGameId = async (req: Request, res: Response) => {
  const { gameId } = req.query;

  if (!gameId) {
    return res.status(400).json({ message: 'Missing param' });
  }

  const tiles = await prisma.tile.findMany({
    where: {
      gameId: gameId as string,
    },
  });

  res.json(tiles);
};
