import { atom } from 'jotai';
import { Tile } from 'database';

export const tilesAtom = atom<Tile[]>([]);
