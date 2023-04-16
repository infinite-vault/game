import { Request, Response } from 'express';
import { createJwt } from '../auth/createJwt';
import { getJwtPayload } from '../auth/getJwtPayload';
import { getUser } from '../prisma/queries/getUser';

export const login = async (req: Request, res: Response) => {
  const isProduction = process.env.NODE_ENV === 'production';
  const userId = await getUserIdByEmailOrJwt(req);

  if (userId) {
    res
      .cookie('jwt', createJwt(userId), {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'strict' : 'lax',
      })
      .json({ id: userId });
  } else {
    res.clearCookie('jwt').json({ login: false });
  }
};

const getUserIdByEmailOrJwt = async (req: Request) => {
  const { email } = req.body;

  if (email) {
    const user = await getUser(email);
    return user?.id;
  } else if (req.cookies['jwt']) {
    const payload = getJwtPayload(req.cookies.jwt);
    return payload?.id;
  }

  return null;
};
