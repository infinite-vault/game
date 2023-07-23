import { atomWithDefault } from 'jotai/utils';
import { gameIdAtom } from './gameState';
import { getPlayersByGameId } from '../../api/getPlayersByGameId';

export const playersAtom = atomWithDefault((get) => {
  const gameId = get(gameIdAtom);
  return gameId ? getPlayersByGameId(gameId) : null;
});
