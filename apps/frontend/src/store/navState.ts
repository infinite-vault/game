import { atom } from 'jotai';
import { NavState } from '../types/NavState';

export const navAtom = atom<NavState>(NavState.FIGHTS);
