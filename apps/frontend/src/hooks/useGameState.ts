import { useAtomValue, useSetAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { gameAtom, gameIdAtom } from '../store/game/gameState';
import { socket } from '../sockets';
import { SocketEvent } from 'types';
import { triggerFetchAtom } from '../store/triggerFetchState';

export enum GameState {
  LOADING = 'LOADING',
  READY = 'READY',
  OFFLINE = 'OFFLINE',
}

export const useGameState = (gameId: string) => {
  const [gameState, setReady] = useState(GameState.LOADING);
  const setGameId = useSetAtom(gameIdAtom);
  const game = useAtomValue(gameAtom);

  useEffect(() => {
    const online = () => {
      setReady(GameState.READY);
    };
    const offline = () => setReady(GameState.OFFLINE);

    window.addEventListener('online', online);
    window.addEventListener('offline', offline);

    return () => {
      window.removeEventListener('online', online);
      window.removeEventListener('offline', offline);
    };
  }, []);

  useEffect(() => {
    setGameId(gameId);
    socket.emitWithAck(SocketEvent.JOIN_ROOM, gameId).then(() => setReady(GameState.READY));

    return () => {
      socket.emit(SocketEvent.LEAVE_ROOM, gameId);
      setGameId(null);
      setReady(GameState.LOADING);
    };
  }, [gameId]);

  return { gameState, game };
};
