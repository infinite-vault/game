import {
  Action,
  ActionType,
  Character,
  Prisma,
  PrismaClient,
  Stats,
  Tile,
  TileType,
} from 'database';
import { prisma } from '../../../prisma/prismaClient';
import { pubsub } from '../../../pubsub';
import { PublishKey } from '../../../types/PublishKey';
import { getRandomInt } from '../../../utils/getRandomInt';
import { settings } from '../../../config/settings';

export const createTile = async (
  gameId: string,
  x: number,
  y: number,
  player: Character & { action: Action | null; stats: Stats | null; tile: Tile | null },
  publish = true,
  client: PrismaClient | Prisma.TransactionClient = prisma,
) => {
  const tileDistance = Math.max(Math.abs(x), Math.abs(y));
  const possibleTiles = settings.tiles.filter((tile) => {
    const isInRange =
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

  // TODO: implement game theme/settings
  // TODO: decide on surrounding tiles
  const isEnemy = newTile.type === TileType.ENEMY;
  let enemy;

  if (isEnemy) {
    data.type = TileType.ENEMY;

    enemy = await client.character.create({
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
              id: player.id,
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
          id: player.id,
        },
        {
          id: enemy.id,
        },
      ],
    } as Prisma.CharacterCreateNestedManyWithoutTileInput;
  }

  const tile = await client.tile.create({ data, include: { actions: true, characters: true } });

  if (enemy) {
    enemy = await client.character.findUnique({
      where: {
        id: enemy.id,
      },
      include: {
        action: true,
        stats: true,
        tile: true,
      },
    });
  }

  if (publish) {
    pubsub.publish(PublishKey.UPDATE_TILE, { updateTile: { ...tile } });

    if (enemy) {
      pubsub.publish(PublishKey.UPDATE_PLAYER, { updatePlayer: { ...enemy } });
    }
  }

  return { tile, enemy };
};
