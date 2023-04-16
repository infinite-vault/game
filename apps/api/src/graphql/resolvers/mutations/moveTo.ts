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

  // TODO: move "isTileAllowed" to util function - all 8 surrounding/connected tiles are allowed
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

  // const nextTileType = TileType.EMPTY; // getRandomTileType();

  let tile;
  try {
    tile = await getTile(gameId, x, y);
    // eslint-disable-next-line no-empty
  } catch {}

  if (!tile) {
    // TODO: maybe put transaction around ALL upcoming calls?
    await prisma.$transaction(async (tx) => {
      tile = await createTile(gameId, x, y, player, false, tx);
    });
  }

  if (!tile) {
    throw new GraphQLError('TILE_CREATION_ERROR');
  }

  await updateCharacter(userId, gameId, {
    connection: 'ONLINE',
    tileId: tile.id,
  });

  pubsub.publish(PublishKey.UPDATE_TILE, { updateTile: { ...tile } });

  // if (nextAction === NextAction.FIGHT) {
  //   await createFight(gameId, player.id, tile?.enemyId as number, tile?.id as number);
  // }

  return true;
};
