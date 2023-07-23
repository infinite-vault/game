import { Request, Response } from 'express';
import { prisma } from '../../../prisma/prismaClient';

export const addCharacterToExistingGame = async (req: Request, res: Response) => {
  const { code, characterId } = req.body;

  // TODO: Check first if USER has already a character in this group
  // is only one character per USER allowed?

  // TODO: add proper error handling for params and transaction errors

  if (!code || !characterId) {
    res.status(400).send('Missing params');
    return;
  }

  await prisma.$transaction(async (tx) => {
    const game = await tx.game.update({
      where: {
        id: code,
      },
      data: {
        characters: {
          connect: {
            id: characterId,
          },
        },
      },
    });

    await tx.character.update({
      where: {
        id: characterId,
      },
      data: {
        game: {
          connect: {
            id: game.id,
          },
        },
        tile: {
          connect: {
            gameId_x_y: {
              gameId: game.id,
              x: 0,
              y: 0,
            },
          },
        },
      },
    });
  });

  res.sendStatus(200);
};
