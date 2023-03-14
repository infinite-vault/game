import jwt from 'jsonwebtoken';

export const createJwt = (id: number | string, expiresIn = '90d') =>
  jwt.sign({ id }, process.env.JWT_SECRET as string, { expiresIn });
