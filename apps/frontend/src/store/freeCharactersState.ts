import { atomWithDefault } from 'jotai/utils';
import { atom } from 'jotai';
import { getFreeCharacters } from '../api/getFreeCharacters';

export const freeCharactersAtom = atomWithDefault(() => getFreeCharacters());

export const refetchFreeCharactersAtom = atom(
  () => null,
  (_get, set) => {
    set(freeCharactersAtom, getFreeCharacters());
  },
);
