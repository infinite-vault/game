import { prisma } from '../prismaClient';

export const getUserById = async (id: string) =>
  await prisma.user.findUnique({
    where: { id },
  });
