import { atomWithDefault } from 'jotai/utils';
import { atom } from 'jotai';
import { getFreeCharacters } from '../api/getFreeCharacters';
import { getMyGames } from '../api/getMyGames';

export const myGamesAtom = atomWithDefault(() => getMyGames());

export const refetchMyGamesAtom = atom(
  () => null,
  (_get, set) => {
    set(myGamesAtom, getMyGames());
  },
);
