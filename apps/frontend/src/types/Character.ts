import { Prisma } from 'database';

export type CharacterWithRelations = Prisma.CharacterGetPayload<{
  include: { stats: true; tile: true };
}>;

export enum CharacterConnection {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
  AFK = 'AFK',
}
