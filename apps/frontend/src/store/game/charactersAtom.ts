import { atom } from 'jotai';
import { Character } from 'database';

export const charactersAtom = atom<Character[]>([]);
