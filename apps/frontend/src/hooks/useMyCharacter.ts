import { useAtomValue } from 'jotai';
import { authAtom } from '../store/authState';
import { Character } from '../types/Character';

export const useMyCharacter = (players: Character[]) => {
  const userId = useAtomValue(authAtom);

  if (!userId || !players?.length) {
    console.log('useMyCharacter undefined', { userId, players });
    return undefined;
  }

  return players.find((player) => player.userId === userId);
};
