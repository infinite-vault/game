import { Request, Response } from 'express';
import { prisma } from '../../../prisma/prismaClient';
import { ActionType } from 'database';

export const getActionsByGameId = async (req: Request, res: Response) => {
  const gameId = req.query.gameId as string;

  if (!gameId) {
    return res.status(400).json({ message: 'Missing param' });
  }

  const actions = await prisma.action.findMany({
    where: { gameId, type: { not: ActionType.OVER } },
    include: {
      characters: {
        select: {
          id: true,
        },
      },
      tile: {
        select: {
          id: true,
        },
      },
    },
    orderBy: {
      id: 'asc',
    },
  });

  res.json(actions);
};
