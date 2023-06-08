import { TileType } from 'database';
import { settings } from '../../../config/settings';
import { prisma } from '../../../prisma/prismaClient';
import { getRandomInt } from '../../../utils/getRandomInt';

export const addCharacterToNewGame = async (_: any, { characterId, name }: any) =>
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

    return game;
  });
