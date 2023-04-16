import { GraphQLError } from 'graphql';
import { updateCharacter } from '../helpers/updateCharacter';

export const setGameState = async (_: any, { gameId, connection }: any, { userId }: any) => {
  if (!['AFK', 'ONLINE', 'OFFLINE'].includes(connection)) {
    throw new GraphQLError('UnknownStatus', {
      extensions: {
        code: 'UNKNOWNSTATUS',
        http: { status: 401 },
      },
    });
  }

  await updateCharacter(userId, gameId, { connection });

  return true;
};
