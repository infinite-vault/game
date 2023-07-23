import { Request, Response } from 'express';
import { prisma } from '../../../prisma/prismaClient';
import { getRandomInt } from '../../../utils/getRandomInt';
import { getStatsByLevel } from '../../../utils/getStatsByLevel';

export const addCharacter = async (req: Request, res: Response) => {
  await prisma.character.create({
    data: {
      name: req.body.name,
      avatar: 'default',
      userId: (req as any).userId,

      stats: {
        create: {
          level: getRandomInt(2, 7),
          ep: 0,

          ...getStatsByLevel(3),
        },
      },
    },
  });

  // const characters = await prisma.character.create({
  //   data: {
  //     userId: (req as any).userId,
  //   },
  //   orderBy: {
  //     name: 'asc',
  //   },
  //   include: { stats: true },
  // });

  res.sendStatus(200);
};
