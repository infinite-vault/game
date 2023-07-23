import { NextFunction, Request, Response } from 'express';
import { getJwtPayload } from '../../auth/getJwtPayload';

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  const jwt = req.cookies['jwt'];
  const payload = getJwtPayload(req.cookies.jwt);
  const userId = payload?.id;

  if (userId) {
    console.log('userId found', userId);
    (req as any).userId = userId;

    next();
  } else {
    res.status(401);
    res.send('Access forbidden');
  }
};
