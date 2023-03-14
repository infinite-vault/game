import { Character } from 'database';
import { prisma } from '../../../prisma/prismaClient';
import { NextAction } from '../../../types/NextAction';

export const isRoundComplete = async ({ gameId }: { gameId: string }): Promise<boolean | Character[]> => {
  const characters = await prisma.character.findMany({
    where: {
      gameId,
      status: 'online',
    },
    include: {
      stats: true,
    },
  });

  // All characters must be online AND not in a movement action
  if (
    characters.length &&
    characters.filter((character) => character.nextAction !== NextAction.MOVE).length === characters.length
  ) {
    return characters;
  }

  return false;
};
