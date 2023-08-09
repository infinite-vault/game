import { useAtomValue } from 'jotai';
import { authAtom } from '../store/authState';
import { useMemo } from 'react';
import { Character } from 'database';
import { CharacterWithRelations } from '../types/CharacterWithRelations';

export const useMyCharacter = (
  players: CharacterWithRelations[] = [],
): CharacterWithRelations | undefined => {
  const userId = useAtomValue(authAtom);
  const me = useMemo(() => players.find((player) => player.userId === userId), [players, userId]);
  return me;
};
