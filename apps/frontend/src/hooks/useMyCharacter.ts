import { useAtomValue } from 'jotai';
import { authAtom } from '../store/authState';
import { CharacterWithRelations } from '../types/Character';

export const useMyCharacter = (players: CharacterWithRelations[]) => {
  const userId = useAtomValue(authAtom);

  if (!userId || !players?.length) {
    console.log('useMyCharacter undefined', { userId, players });
    return undefined;
  }

  return players.find((player) => player.userId === userId);
};
