import { Request, Response } from 'express';
import { prisma } from '../../../prisma/prismaClient';
import { updateCharacter } from '../mutations/updateCharacter';
import { CharacterStatus } from 'database';

export const game = async (req: Request, res: Response) => {
  const { userId } = req;
  const { gameId } = req.query;

  if (!gameId || !userId) {
    res.status(400).json({ error: 'gameId is required' });
  }

  await updateCharacter(userId as string, gameId as string, { status: CharacterStatus.ONLINE });

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
