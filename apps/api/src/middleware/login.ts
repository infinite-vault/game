import { Request, Response } from 'express';
import { createJwt } from '../auth/createJwt';
import { getJwtPayload } from '../auth/getJwtPayload';
import { getUser } from '../prisma/queries/getUser';

export const login = async (req: Request, res: Response) => {
  const { email } = req.body;
  const isProduction = process.env.NODE_ENV === 'production';
  let id;

  if (email) {
    const user = await getUser(email);
    id = user?.id;
  } else if (req.cookies['jwt']) {
    const payload = getJwtPayload(req.cookies.jwt);
    id = payload?.id;
  }

  if (id) {
    res
      .cookie('jwt', createJwt(id), {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'strict' : 'lax',
      })
      .json({ id });
  } else {
    res.clearCookie('jwt').json({ login: false });
  }
};
