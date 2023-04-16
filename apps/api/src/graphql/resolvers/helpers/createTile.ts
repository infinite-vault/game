import { Action, Character, Prisma, PrismaClient, Stats, Tile } from 'database';
import { prisma } from '../../../prisma/prismaClient';
import { pubsub } from '../../../pubsub';
import { PublishKey } from '../../../types/PublishKey';
import { getRandomInt } from '../../../utils/getRandomInt';

export const createTile = async (
  gameId: string,
  x: number,
  y: number,
  player: Character & { action: Action | null; stats: Stats | null; tile: Tile | null },
  publish = true,
  client: PrismaClient | Prisma.TransactionClient = prisma,
) => {
  const data: Prisma.TileCreateInput = {
    game: {
      connect: {
        id: gameId,
      },
    },
    x,
    y,
    type: 'EMPTY',
  };

  // TODO: decide on surrounding tiles
  const isMonster = getRandomInt(0, 10) < 4;

  if (isMonster) {
    data.type = 'ENEMY';

    // TODO decide on stats depending on radius to center
    const monster = await client.character.create({
      data: {
        game: { connect: { id: gameId } },
        name: 'Enemy',
        avatar: 'monster',
        isNpc: true,
        stats: {
          create: {
            level: 3,
            hp: 10,
            strength: 5,
          },
        },
      },
    });

    // TODO move into clearly chained transaction and publish only after success
    pubsub.publish(PublishKey.UPDATE_PLAYER, { updatePlayer: { ...monster } });

    // TODO decide on player/monster stats if action is required
    data.actions = {
      create: {
        game: { connect: { id: gameId } },
        type: 'ATTACK',
        characters: {
          connect: [
            {
              id: player.id,
            },
            {
              id: monster.id,
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
          id: monster.id,
        },
      ],
    } as Prisma.CharacterCreateNestedManyWithoutTileInput;
  }

  const tile = await client.tile.create({ data, include: { actions: true, characters: true } });

  if (publish) {
    pubsub.publish(PublishKey.UPDATE_TILE, { updateTile: { ...tile } });
  }

  return tile;
};
