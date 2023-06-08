import { Prisma } from 'database';

export type TileWithRelations = Prisma.TileGetPayload<{
  include: { characters: true; actions: true };
}>;

export enum TileType {
  START = 'START',
  ENEMY = 'ENEMY',
  DEFEATED = 'DEFEATED',
  PORTAL = 'PORTAL',
  BOSS = 'BOSS',
  SHOP = 'SHOP',
  TREASURE = 'TREASURE',
  TRAP = 'TRAP',
  EMPTY = 'EMPTY',
}
