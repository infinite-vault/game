import { Prisma, PrismaClient } from 'database';
import { prisma } from '../../../prisma/prismaClient';
import { pubsub } from '../../../pubsub';
import { PublishKey } from '../../../types/PublishKey';
import { TileType } from '../../../types/TileType';
import { getStatsByLevel } from '../../../utils/getStatsByLevel';

export const createTileAndEnemy = async (
  gameId: string,
  x: number,
  y: number,
  nextTileType: string,
  publish = true,
  client: PrismaClient | Prisma.TransactionClient = prisma,
) => {
  const data: Prisma.TileUncheckedCreateInput = {
    gameId,
    x,
    y,
    type: nextTileType,
  };

  // TODO: add median level from whole group
  if (nextTileType === TileType.MONSTER) {
    const enemy = await client.enemy.create({
      data: {
        name: 'Monster',
        stats: {
          create: {
            ...getStatsByLevel(1),
          },
        },
      },
    });

    data['enemyId'] = enemy.id;
  }

  const tile = await client.tile.create({ data });

  if (publish) {
    pubsub.publish(PublishKey.UPDATE_TILE, { updateTile: { ...tile } });
  }

  return tile;
};
