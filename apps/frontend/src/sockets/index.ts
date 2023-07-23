import { io } from 'socket.io-client';
import { SocketEvent } from 'types';

export const socket = io(`ws://localhost:4001`, {
  autoConnect: false,
  reconnectionDelayMax: 10000,
  transports: ['websocket', 'polling'],
  withCredentials: true,
});

// export const connectSocket = (token = '') => {
//   console.log('connect socket token', token || 'non-set');

//   if (token) {
//     socket.auth = { token };
//     socket.disconnect().connect();
//   }
// };

socket.on('connect', () => {
  //   ts.start();
  console.log('socket connected');
});

socket.on('disconnect', () => {
  console.log('socket disconnected');
});

socket.on('connect_error', (err) => {
  console.log('connect error', err.message);
});
