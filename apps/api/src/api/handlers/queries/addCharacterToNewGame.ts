import { Request, Response } from 'express';
import { prisma } from '../../../prisma/prismaClient';
import { getRandomInt } from '../../../utils/getRandomInt';
import { settings } from '../../../config/settings';
import { TileType } from 'database';

export const addCharacterToNewGame = async (req: Request, res: Response) => {
  const { name, characterId } = req.body;

  // TODO: add proper error handling for params and transaction errors

  if (!name || !characterId) {
    res.status(400).send('Missing params');
    return;
  }

  await prisma.$transaction(async (tx) => {
    const startTile = settings.tiles.find((tile) => tile.type === TileType.START);

    if (!startTile) {
      throw new Error('No start tile found');
    }

    const game = await tx.game.create({
      data: {
        name,
        characters: {
          connect: {
            id: characterId,
          },
        },
        tiles: {
          create: {
            x: 0,
            y: 0,
            type: TileType.START,
            background: startTile.backgrounds[getRandomInt(0, startTile.backgrounds.length - 1)],
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
