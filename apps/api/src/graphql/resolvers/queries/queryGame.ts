import { prisma } from '../../../prisma/prismaClient';
import { updateCharacter } from '../helpers/updateCharacter';

export const queryGame = async (_: any, { gameId }: any, { userId }: any) => {
  // TODO: move status to enum
  await updateCharacter(userId, gameId, { status: 'online' });
  console.log('###############################\n  ### USER ONLINE ### \n###############################');

  return await prisma.game.findUnique({
    where: {
      id: gameId,
    },
  });
};
