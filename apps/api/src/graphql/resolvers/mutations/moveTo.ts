import { GraphQLError } from 'graphql';
import { prisma } from '../../../prisma/prismaClient';
import { pubsub } from '../../../pubsub';
import { PublishKey } from '../../../types/PublishKey';
import { createTile } from '../helpers/createTile';
import { getCharacter } from '../helpers/getCharacter';
import { getTile } from '../helpers/getTile';
import { updateCharacter } from '../helpers/updateCharacter';

export const moveTo = async (_: any, { gameId, x, y }: any, { userId }: any) => {
  const player = await getCharacter(userId, gameId);

  const isTileAllowed =
    player?.tile &&
    !player?.action &&
    ((x === player.tile.x && (y === player.tile.y + 1 || y === player.tile.y - 1)) ||
      (y === player.tile.y && (x === player.tile.x + 1 || x === player.tile.x - 1)) ||
      ((x === player.tile.x + 1 || x === player.tile.x - 1) &&
        (y === player.tile.y + 1 || y === player.tile.y - 1)));

  if (!isTileAllowed) {
    throw new GraphQLError('TILE_POSITION_FORBIDDEN');
  }

  await prisma.$transaction(async (tx) => {
    let tile;
    let enemy;

    try {
      tile = await getTile(gameId, x, y);
      // eslint-disable-next-line no-empty
    } catch {}

    if (!tile) {
      const result = await createTile(gameId, x, y, player, false, tx);
      tile = result.tile;
      enemy = result.enemy;
    }

    if (!tile) {
      throw new GraphQLError('TILE_CREATION_ERROR');
    }

    const character = await updateCharacter(
      userId,
      gameId,
      {
        connection: 'ONLINE',
        tileId: tile.id,
      },
      false,
      tx,
    );

    pubsub.publish(PublishKey.UPDATE_TILE, { updateTile: { ...tile } });
    pubsub.publish(PublishKey.UPDATE_PLAYER, { updatePlayer: { ...character } });
    if (enemy) {
      pubsub.publish(PublishKey.UPDATE_PLAYER, { updatePlayer: { ...enemy } });
    }
  });

  return true;
};
