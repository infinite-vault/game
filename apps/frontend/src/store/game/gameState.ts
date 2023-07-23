import { atomWithDefault } from 'jotai/utils';
import { getGameById } from '../../api/getGameById';
import { atom } from 'jotai';
import { Game } from 'database';

export const gameIdAtom = atom<string | null>(null);
export const gameAtom = atomWithDefault<Promise<Game> | null>((get) => {
  const gameId = get(gameIdAtom);
  return gameId ? getGameById(gameId) : null;
});
