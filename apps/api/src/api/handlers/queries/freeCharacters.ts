import { Request, Response } from 'express';
import { prisma } from '../../../prisma/prismaClient';

export const freeCharacters = async (req: Request, res: Response) => {
  const characters = await prisma.character.findMany({
    where: {
      userId: (req as any).userId,
      game: null,
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: { stats: true },
  });

  res.json(characters);
};
