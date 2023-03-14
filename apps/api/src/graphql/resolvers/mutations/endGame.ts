import { updateCharacter } from '../helpers/updateCharacter';

export const endGame = async (_: any, { gameId }: any, { userId }: any) => {
  await updateCharacter(userId, gameId, { status: 'offline' });
  console.log('###############################\n  ### USER OFFLINE ### \n###############################');
  return true;
};
