import { ActionType, Prisma, PrismaClient, TileType } from 'database';
import { prisma } from '../../../prisma/prismaClient';
import { getRandomInt } from '../../../utils/getRandomInt';
import { settings } from '../../../config/settings';

export const createTile = async (
  gameId: string,
  x: number,
  y: number,
  playerId: number,
  client: PrismaClient | Prisma.TransactionClient = prisma,
) => {
  const tileDistance = Math.max(Math.abs(x), Math.abs(y));
  const possibleTiles = settings.tiles.filter((tile) => {
    const isInRange =
      tile.type !== TileType.START &&
      (!tile.minDistance || tile.minDistance <= tileDistance) &&
      (!tile.maxDistance || tile.maxDistance >= tileDistance);
    return isInRange;
  });

  const weightsSum = possibleTiles.reduce((sum, tile) => sum + tile.weight, 0);
  const randomWeight = getRandomInt(0, weightsSum);

  let currentWeight = 0;
  const newTile = possibleTiles.find((tile) => {
    currentWeight += tile.weight;
    return currentWeight >= randomWeight;
  });

  if (!newTile) {
    throw new Error('No tile type found');
  }

  const data: Prisma.TileCreateInput = {
    game: {
      connect: {
        id: gameId,
      },
    },
    x,
    y,
    type: newTile.type,
    background: newTile.backgrounds[getRandomInt(0, newTile.backgrounds.length - 1)],
  };

  const { tile, enemy } = await prisma.$transaction(async (tx) => {
    const isEnemy = newTile.type === TileType.ENEMY;
    let enemy;

    if (isEnemy) {
      enemy = await tx.character.create({
        data: {
          game: { connect: { id: gameId } },
          name: newTile.enemy.name,
          avatar: 'monster',
          isNpc: true,
          stats: {
            create: {
              level: getRandomInt(newTile.enemy.stats.levelMin, newTile.enemy.stats.levelMax),
              hp: getRandomInt(newTile.enemy.stats.hpMin, newTile.enemy.stats.hpMax),
              strength: getRandomInt(
                newTile.enemy.stats.strengthMin,
                newTile.enemy.stats.strengthMax,
              ),
            },
          },
        },
      });

      data.actions = {
        create: {
          game: { connect: { id: gameId } },
          type: ActionType.PENDING,
          characters: {
            connect: [
              {
                id: playerId,
              },
              {
                id: enemy.id,
              },
            ],
          },
        },
      } as Prisma.ActionCreateNestedManyWithoutTileInput;

      data.characters = {
        connect: [
          {
            id: playerId,
          },
          {
            id: enemy.id,
          },
        ],
      } as Prisma.CharacterCreateNestedManyWithoutTileInput;
    }

    const tile = await tx.tile.create({ data, include: { actions: true, characters: true } });

    return { tile, enemy };
  });

  let connectedEnemy;
  let action;

  if (enemy) {
    connectedEnemy = await client.character.findUnique({
      where: {
        id: enemy.id,
      },
      include: {
        action: true,
        stats: true,
        tile: true,
      },
    });

    if (!connectedEnemy) {
      throw new Error('Enemy not found');
    }

    action = await client.action.findUnique({
      where: {
        id: connectedEnemy.action?.id,
      },
      include: {
        characters: {
          select: {
            id: true,
          },
        },
      },
    });
  }

  return { tile, enemy: connectedEnemy, action };
};
