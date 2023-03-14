import { Request, Response } from 'express';

export const logout = (_req: Request, res: Response) => {
  res.clearCookie('jwt').sendStatus(200);
};
