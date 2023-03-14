import { createJwt } from '../../../auth/createJwt';
import { getJwtPayload } from '../../../auth/getJwtPayload';
import { getUser } from '../../../prisma/queries/getUser';
import { getUserById } from '../../../prisma/queries/getUserById';

export const queryUser = async (_: any, { email }: any, { req, res }: any) => {
  let user;

  if (email) {
    user = await getUser(email);
  } else if (req.cookies['jwt']) {
    const payload = getJwtPayload(req.cookies['jwt']);

    if (payload?.id) {
      user = await getUserById(payload.id);
    }
  }

  if (user?.id) {
    res.cookie('jwt', createJwt(user.id), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 90 * 24 * 60 * 60 * 1000,
    });
  } else {
    console.log('invalid user login', req.cookies, email);
  }

  return user;
};
