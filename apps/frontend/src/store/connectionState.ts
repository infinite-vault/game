import { atom } from 'jotai';

export const connectionAtom = atom<'online' | 'offline'>('offline');
