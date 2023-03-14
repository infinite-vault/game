import jwt from 'jsonwebtoken';

interface JwtPayload {
  id: string;
  iat: number;
  exp: number;
}

export const getJwtPayload = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
  } catch {
    return null;
  }
};
