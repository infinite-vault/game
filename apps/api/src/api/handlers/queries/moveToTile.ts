import { Request, Response } from 'express';
import { prisma } from '../../../prisma/prismaClient';
import { getCharacter } from '../../queries/getCharacter';
import { getTile } from '../../queries/getTile';
import { createTile } from '../mutations/createTile';
import { updateCharacter } from '../mutations/updateCharacter';
import { io } from '../../..';
import { SocketEvent } from 'types';

export const moveToTile = async (req: Request, res: Response) => {
  try {
    move(req, res);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: 'SERVER_ERROR' });
  }
};

const move = async (req: Request, res: Response) => {
  const { gameId, x, y } = req.body;
  const userId = (req as any).userId;
  const player = await getCharacter(userId, gameId);

  if (!player) {
    throw new Error('PLAYER_NOT_FOUND');
  }

  const isTileAllowed =
    player.tile &&
    !player.action &&
    ((x === player.tile.x && (y === player.tile.y + 1 || y === player.tile.y - 1)) ||
      (y === player.tile.y && (x === player.tile.x + 1 || x === player.tile.x - 1)) ||
      ((x === player.tile.x + 1 || x === player.tile.x - 1) &&
        (y === player.tile.y + 1 || y === player.tile.y - 1)));

  if (!isTileAllowed) {
    throw new Error('TILE_NOT_ALLOWED');
  }

  await prisma.$transaction(async (tx) => {
    let tile;
    let isTileNew = false;
    let enemy;
    let action;

    // get existing tile
    try {
      tile = await getTile(gameId, x, y);
      // eslint-disable-next-line no-empty
    } catch {}

    // create new tile, optionally enemy and action
    if (!tile) {
      const result = await createTile(gameId, x, y, player.id as number, tx);
      tile = result.tile;
      enemy = result.enemy;
      action = result.action;
      isTileNew = true;
    }

    if (!tile) {
      throw new Error('TILE_CREATION_ERROR');
    }

    const character = await updateCharacter(
      userId,
      gameId,
      {
        connection: 'ONLINE',
        tileId: tile.id,
        version: {
          increment: 1,
        },
      },
      tx,
    );

    io.in(gameId).emit(SocketEvent.CHARACTER_UPDATE, { data: character });
    io.in(gameId).emit(SocketEvent.TILE_UPDATE, { data: tile, isFullUpdate: isTileNew });

    if (enemy) {
      io.in(gameId).emit(SocketEvent.CHARACTER_UPDATE, { data: enemy, isFullUpdate: true });
    }

    if (action) {
      io.in(gameId).emit(SocketEvent.ACTION_UPDATE, { data: action, isFullUpdate: true });
    }
  });

  res.json(true);
};
