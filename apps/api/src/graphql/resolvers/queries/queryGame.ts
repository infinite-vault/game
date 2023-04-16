import { prisma } from '../../../prisma/prismaClient';
import { updateCharacter } from '../helpers/updateCharacter';

export const queryGame = async (_: any, { gameId }: any, { userId }: any) => {
  // TODO: move status to enum
  await updateCharacter(userId, gameId, { connection: 'ONLINE' });

  return await prisma.game.findUnique({
    where: {
      id: gameId,
    },
    include: {
      characters: true,
    },
  });
};
