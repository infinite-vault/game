import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { createServer } from 'http';
import express from 'express';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import { json } from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { getJwtPayload } from './auth/getJwtPayload';
import { resolvers } from './graphql/resolvers/resolvers';
import { typeDefs } from './graphql/typeDefs';
import { GraphQLError } from 'graphql';
import { login } from './middleware/login';
import { logout } from './middleware/logout';
import { Server } from 'socket.io';
import { initSocketListeners } from './sockets/initSocketListeners';

import './bull/bull';

dotenv.config();
console.log('NODE_ENV', process.env.NODE_ENV);

const PORT = parseInt(process.env.API_PORT || '8080');
const app = express();
const httpServer = createServer(app);

app.disable('x-powered-by');

// export const io = new Server(httpServer, {
export const io = new Server(4001, {
  // cors: { origin: process.env.CORS_ORIGIN || 'http://localhost:3000', credentials: true },
  // cors: { origin: 'http://localhost:3000', credentials: true },
  cors: { origin: 'http://localhost:3000' },
  pingTimeout: 5000,
  pingInterval: 11000,
  cookie: true,
});

const wsServer = new WebSocketServer({
  server: httpServer,
  path: '/graphql',
});

const schema = makeExecutableSchema({ typeDefs, resolvers });
const serverCleanup = useServer({ schema }, wsServer);
const server = new ApolloServer({
  schema,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
  ],
});

(async () => {
  // await seedData();
  await server.start();

  app.use(cookieParser());
  app.use(json());
  app.use(
    cors({
      credentials: true,
      origin: process.env.CORS_ORIGIN as string,
    }),
  );

  // maybe necessary for later when we need to force logout while being offline
  // app.use((req, res, next) => {
  //   if (req.cookies['force_logout']) {
  //     res.clearCookie('force_logout').clearCookie('jwt').status(200).json('logout forced');
  //   } else {
  //     next();
  //   }
  // });

  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: async ({ req, res }) => {
        const payload = getJwtPayload(req.cookies.jwt);
        const isAuthenticated = !!payload;

        if (!isAuthenticated) {
          throw new GraphQLError('Unauthenticated', {
            extensions: {
              code: 'UNAUTHENTICATED',
              http: { status: 401 },
            },
          });
        }

        return { req, res, isAuthenticated, userId: payload.id };
      },
    }),
  );

  app.post('/login', login);
  app.get('/logout', logout);

  initSocketListeners(io);

  httpServer.listen(PORT, () => {
    console.log(`🚀 Server listening on port: ${PORT}`);
  });
})();
