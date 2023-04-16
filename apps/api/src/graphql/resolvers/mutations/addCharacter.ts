import { prisma } from '../../../prisma/prismaClient';
import { getRandomInt } from '../../../utils/getRandomInt';
import { getStatsByLevel } from '../../../utils/getStatsByLevel';

export const addCharacter = async (_: any, { name }: any, { userId }: any) =>
  await prisma.character.create({
    data: {
      name,
      avatar: 'default',
      userId,

      stats: {
        create: {
          level: getRandomInt(2, 7),
          ep: 0,

          ...getStatsByLevel(3),
        },
      },
    },
  });
