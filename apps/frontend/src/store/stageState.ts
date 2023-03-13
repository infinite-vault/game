import { atom } from 'jotai';
import { Stage } from 'konva/lib/Stage';

export const stageAtom = atom<Stage | null>(null);
