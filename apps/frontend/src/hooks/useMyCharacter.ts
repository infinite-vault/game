import { useAtomValue } from 'jotai';
import { authAtom } from '../store/authState';
import { useMemo } from 'react';
import { Character } from 'database';

export const useMyCharacter = (players: Character[] = []): Character | undefined => {
  const userId = useAtomValue(authAtom);
  const me = useMemo(() => players.find((player) => player.userId === userId), [players, userId]);
  return me;
};
