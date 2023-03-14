import { prisma } from '../prismaClient';

export const getUser = async (email: string) => {
  let user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    user = await prisma.user.create({ data: { email } });
  }

  return user;
};
