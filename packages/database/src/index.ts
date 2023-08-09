import { Prisma } from '../generated/prisma-client';
export * from '../generated/prisma-client';

export type CharacterWithRelations = Prisma.CharacterGetPayload<{
  include: { action: true; stats: true; tile: true; loot: true };
}>;

// export enum CharacterConnection {
//   ONLINE = 'ONLINE',
//   OFFLINE = 'OFFLINE',
//   AFK = 'AFK',
// }
