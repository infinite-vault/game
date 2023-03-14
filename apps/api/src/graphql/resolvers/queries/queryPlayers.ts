import { prisma } from '../../../prisma/prismaClient';
import { updateCharacter } from '../helpers/updateCharacter';

export const queryPlayers = async (_: any, { gameId }: any, { userId }: any) => {
  // TODO: move status to enum
  await updateCharacter(userId, gameId, { status: 'online' });

  const characters = await prisma.character.findMany({
    where: {
      gameId,
    },
    include: {
      user: true,
      stats: true,
    },
  });

  return characters;
};
