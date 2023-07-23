import { createServer } from 'http';
import express, { Request, Response } from 'express';
import { json } from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { Server } from 'socket.io';
import { initSockets } from './sockets/initSockets';
import { initApi } from './api/initApi';

import './bull/bull';
import { initMiddleware } from './api/initMiddleware';

dotenv.config();
console.log('NODE_ENV', process.env.NODE_ENV);

const PORT = parseInt(process.env.API_PORT || '8080');
const app = express();
const httpServer = createServer(app);

app.disable('x-powered-by');
app.use(cookieParser());
app.use(json());
app.use(
  cors({
    credentials: true,
    origin: process.env.CORS_ORIGIN as string,
  }),
);

// TODO: use httpServer instead of 4001 custom port
// export const io = new Server(httpServer, {
export const io = new Server(4001, {
  // cors: { origin: process.env.CORS_ORIGIN || 'http://localhost:3000', credentials: true },
  cors: { origin: 'http://localhost:3000', credentials: true },
  // cors: { origin: 'http://localhost:3000' },
  pingTimeout: 5000,
  pingInterval: 11000,
  cookie: true,
});

(async () => {
  // TODO: init bull queue, db connection, redis connection

  initMiddleware(app);
  initApi(app);
  initSockets(io);

  app.use((err: Error, _req: Request, res: Response) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

  httpServer.listen(PORT, () => {
    console.log(`🚀 Server listening on port: ${PORT}`);
  });
})();
