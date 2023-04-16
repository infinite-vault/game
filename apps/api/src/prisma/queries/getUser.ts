import { prisma } from '../prismaClient';
import { User } from 'database';

export const getUser = async (rawEmail: string): Promise<User> => {
  const email = rawEmail.toLowerCase();

  const auth = await prisma.auth.findUnique({
    where: { email },
    include: { user: true },
  });

  if (!auth) {
    return await prisma.user.create({ data: { auths: { create: { email, password: '' } } } });
  }

  return auth.user;
};
