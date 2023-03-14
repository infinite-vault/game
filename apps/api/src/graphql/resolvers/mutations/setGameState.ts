import { GraphQLError } from 'graphql';
import { updateCharacter } from '../helpers/updateCharacter';

export const setGameState = async (_: any, { gameId, status }: any, { userId }: any) => {
  if (!['afk', 'online', 'offline'].includes(status)) {
    throw new GraphQLError('UnknownStatus', {
      extensions: {
        code: 'UNKNOWNSTATUS',
        http: { status: 401 },
      },
    });
  }

  await updateCharacter(userId, gameId, { status });

  return true;
};
