import { Request, Response } from 'express';
import { prisma } from '../../../prisma/prismaClient';

export const addCharacter = async (req: Request, res: Response) => {
  try {
    await createNewCharacter(req);
    res.sendStatus(200);
  } catch (err) {
    res.status(400).json({ error: 'SERVER_ERROR' });
  }
};

const createNewCharacter = async (req: Request) => {
  const { userId } = req;
  const { name } = req.body;

  if (!userId || !name) {
    throw new Error('MISSING_PARAMS');
  }

  await prisma.$transaction(async (tx) => {
    const stats = await tx.stats.create({
      data: {
        attack: 10,
        wisdom: 2,
        agility: 5,
        luck: 2,
      },
    });

    await tx.character.create({
      data: {
        name,
        avatar: 'default',
        userId,
        statsId: stats.id,
      },
    });
  });
};
