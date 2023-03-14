import { prisma } from '../../../prisma/prismaClient';

export const queryFights = async (_: any, { gameId }: any) => {
  const fights = await prisma.fight.findMany({
    where: { gameId, isDeleted: false },
    include: {
      character: true,
      enemy: {
        include: {
          stats: true,
        },
      },
    },
    orderBy: {
      id: 'asc',
    },
  });

  return fights.map((fight) => ({ ...fight, diff: null }));
};
