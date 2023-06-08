import { Prisma } from 'database';

export type ActionWithRelations = Prisma.ActionGetPayload<{
  include: { characters: true; tile: true };
}>;

export enum ActionType {
  PENDING = 'PENDING',
  DRAMA = 'DRAMA',
}

interface FightResult {
  dice: number;
  diceMax: number;
  damage: number;
  isCritical: boolean;
}

export interface FightResults {
  me: FightResult;
  enemy: FightResult;
}
