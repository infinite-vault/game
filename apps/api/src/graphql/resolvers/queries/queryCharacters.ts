import { prisma } from '../../../prisma/prismaClient';

export const queryCharacters = async (_: any, _args: any, { userId }: any) =>
  await prisma.character.findMany({
    where: {
      userId,
    },
    include: {
      stats: true,
    },
  });
