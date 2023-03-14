import { GraphQLError } from 'graphql';
import { prisma } from '../../../prisma/prismaClient';

export const getCharacter = async (userId: string, gameId: string) => {
  const character = await prisma.character.findUnique({
    where: {
      userId_gameId: {
        userId,
        gameId,
      },
    },
    include: {
      stats: true,
    },
  });

  if (!character) {
    throw new GraphQLError('NOT_FOUND');
  }

  return character;
};
