import { prisma } from '../../../prisma/prismaClient';

export const queryActions = async (_: any, { gameId }: any) => {
  const actions = await prisma.action.findMany({
    where: { gameId, isDeleted: false },
    include: {
      characters: true,
      tile: true,
    },
    orderBy: {
      id: 'asc',
    },
  });

  return actions.map((action) => ({ ...action, diff: null }));
};
