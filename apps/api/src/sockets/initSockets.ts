import { Server } from 'socket.io';
import { parse } from 'cookie';
import { SocketEvent } from 'types';
import { getCharacterById } from '../api/queries/getCharacterById';
import { getTileById } from '../api/queries/getTileById';
import { getActionById } from '../api/queries/getActionById';
import { getJwtPayload } from '../auth/getJwtPayload';

export const initSockets = (io: Server) => {
  io.use((socket, next) => {
    const cookies = parse(socket.handshake.headers.cookie || '');
    const payload = getJwtPayload(cookies.jwt);
    socket.data.userId = payload?.id;

    if (!socket.data.userId) {
      return next(new Error('invalid jwt'));
    }

    return next();
  });

  io.on('connection', async (socket) => {
    console.log('init socket', socket.id);

    socket.on('disconnect', (reason) => {
      console.log('socket disconnected', reason, socket.id);
    });

    socket.on('connection_error', (err) => {
      console.log('socket connection_error', err);
    });

    socket.on('error', (err) => {
      console.log('socket error', err.message);
    });

    socket.on('timesync', (_data: any, ack: any) => ack({ now: Date.now() }));

    socket.on(SocketEvent.JOIN_ROOM, (gameId, callback) => {
      // TODO: check if game exists and user is allowed to play it -> by jwt user id
      console.log('join room', { gameId, id: socket.id });
      socket.join(gameId);
      callback(true);
    });

    socket.on(SocketEvent.LEAVE_ROOM, (gameId) => {
      console.log('left room', { gameId, id: socket.id });
      socket.leave(gameId);
    });

    socket.on(SocketEvent.CHARACTER_FULL_UPDATE, async ({ id }) => {
      console.log('###### SOCKET DATA ######', socket.data);
      const character = await getCharacterById(id);
      socket.emit(SocketEvent.CHARACTER_UPDATE, { data: character, isFullUpdate: true });
    });

    socket.on(SocketEvent.TILE_FULL_UPDATE, async ({ id }) => {
      const tile = await getTileById(id);
      socket.emit(SocketEvent.TILE_UPDATE, { data: tile, isFullUpdate: true });
    });

    socket.on(SocketEvent.ACTION_FULL_UPDATE, async ({ id }) => {
      const action = await getActionById(id);
      socket.emit(SocketEvent.ACTION_UPDATE, { data: action, isFullUpdate: true });
    });
  });
};
