import { GraphQLError } from 'graphql';
import { prisma } from '../../../prisma/prismaClient';
import { NextAction } from '../../../types/NextAction';
import { TileType } from '../../../types/TileType';
import { getRandomTileType } from '../../../utils/getRandomTileType';
import { createFight } from '../helpers/createFight';
import { createTileAndEnemy } from '../helpers/createTileAndEnemy';
import { getCharacter } from '../helpers/getCharacter';
import { getTile } from '../helpers/getTile';
import { updateCharacter } from '../helpers/updateCharacter';

export const moveTo = async (_: any, { gameId, x, y }: any, { userId }: any) => {
  let player = await getCharacter(userId, gameId);

  // TODO: move "isTileAllowed" to util function - all 8 surrounding/connected tiles are allowed
  const isTileAllowed =
    player &&
    ((x === player?.x && (y === player?.y + 1 || y === player?.y - 1)) ||
      (y === player?.y && (x === player?.x + 1 || x === player?.x - 1)) ||
      ((x === player?.x + 1 || x === player?.x - 1) && (y === player?.y + 1 || y === player?.y - 1)));

  if (!isTileAllowed) {
    throw new GraphQLError('TILE_POSITION_FORBIDDEN');
  }

  const nextTileType = getRandomTileType();

  let tile;
  try {
    tile = await getTile(gameId, x, y);
    // eslint-disable-next-line no-empty
  } catch {}

  if (!tile) {
    // TODO: maybe put transaction around ALL upcoming calls?
    await prisma.$transaction(async (tx) => {
      tile = await createTileAndEnemy(gameId, x, y, nextTileType, true, tx);
    });
  }

  if (!tile) {
    throw new GraphQLError('TILE_CREATION_ERROR');
  }

  let nextAction = NextAction.MOVE;
  if (tile.type === TileType.MONSTER) {
    nextAction = NextAction.FIGHT;
  } else if (tile.type === TileType.SHOP) {
    nextAction = NextAction.SHOP;
  }

  player = await updateCharacter(userId, gameId, {
    x,
    y,
    status: 'online',
    nextAction,
  });

  if (nextAction === NextAction.FIGHT) {
    await createFight(gameId, player.id, tile?.enemyId as number, tile?.id as number);
  }

  return true;
};
