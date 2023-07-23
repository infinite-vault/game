import { Request, Response } from 'express';
import { prisma } from '../../../prisma/prismaClient';

export const getCharactersByGameId = async (req: Request, res: Response) => {
  const { gameId } = req.query;

  if (!gameId) {
    return res.status(400).json({ message: 'Missing param' });
  }

  const characters = await prisma.character.findMany({
    where: {
      gameId: gameId as string,
    },
    include: {
      action: true,
      stats: true,
      tile: true,
    },
  });

  res.json(characters);
};
