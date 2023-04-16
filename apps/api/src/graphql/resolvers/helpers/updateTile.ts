import { Prisma, PrismaClient } from 'database';
import { prisma } from '../../../prisma/prismaClient';
import { pubsub } from '../../../pubsub';
import { PublishKey } from '../../../types/PublishKey';

export const updateTile = async (
  tileId: number,
  data: Prisma.TileUncheckedUpdateInput,
  publish = true,
  client: PrismaClient | Prisma.TransactionClient = prisma,
) => {
  const tile = await client.tile.update({
    where: {
      id: tileId,
    },
    data,
  });

  if (publish) {
    pubsub.publish(PublishKey.UPDATE_TILE, { updateTile: { ...tile } });
  }

  return tile;
};
