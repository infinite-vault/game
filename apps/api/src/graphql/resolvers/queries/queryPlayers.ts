import { prisma } from '../../../prisma/prismaClient';
import { updateCharacter } from '../helpers/updateCharacter';

export const queryPlayers = async (_: any, { gameId }: any, { userId }: any) => {
  // TODO: move status to enum
  await updateCharacter(userId, gameId, { connection: 'ONLINE' });

  const characters = await prisma.character.findMany({
    where: {
      gameId,
    },
    include: {
      user: true,
      stats: true,
      tile: true,
      action: {
        include: {
          characters: true,
        },
      },
    },
  });

  return characters;
};
