import { Express } from 'express';

export const initMiddleware = (app: Express) => {
  // app.use((req, _res, next) => {
  //   if (req.cookies['jwt']) {
  //     console.log('jwt found');
  //     req.userId = '12345678';
  //   }
  //   next();
  // });
};
