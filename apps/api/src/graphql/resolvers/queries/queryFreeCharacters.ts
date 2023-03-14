import { prisma } from '../../../prisma/prismaClient';

export const queryFreeCharacters = async (_: any, _args: any, { userId }: any) =>
  await prisma.character.findMany({
    where: {
      userId,
      game: {
        is: null,
      },
    },
    include: { stats: true },
  });
