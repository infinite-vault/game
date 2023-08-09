import { atom } from 'jotai';
import { CharacterWithRelations } from '../../types/CharacterWithRelations';

export const charactersAtom = atom<CharacterWithRelations[]>([]);
