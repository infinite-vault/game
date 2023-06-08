import { Server } from 'socket.io';
import { parse } from 'cookie';

export const initSocketListeners = (io: Server) => {
  //   io.use((socket, next) => {
  //     const { uuid } = socket.handshake.auth;
  //     socket.data.uuid = uuid;

  //     console.log('io.use check uuid', uuid);
  //     //check uuid against redis: uuid => username
  //     const user = 'Foobar';

  //     if (user) {
  //       next();
  //     } else {
  //       next(new Error('not registered'));
  //     }
  //   });

  io.use((socket, next) => {
    console.log('socket use jwt', socket.handshake.headers.cookie);

    const cookies = parse(socket.handshake.headers.cookie || '');

    // TODO: validate jwt
    if (!cookies.jwt) {
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

    socket.on('join-game', (gameId, callback) => {
      // TODO: check if game exists and user is allowed to play it -> by jwt user id
      socket.join(gameId);
      callback(true);
    });

    socket.on('leave-game', (gameId, callback) => {
      socket.leave(gameId);
      callback(true);
    });

    socket.on('hello', () => {
      console.log('hello');
      socket.emit('foo');
      socket.emit('bar');
    });
  });
};
