import { atom } from 'jotai';
import { ActionWithRelations } from '../../types/ActionWithRelations';

export const actionsAtom = atom<ActionWithRelations[]>([]);
