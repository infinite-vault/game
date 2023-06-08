import { useAtomValue } from 'jotai';
import { authAtom } from '../store/authState';
import { CharacterWithRelations } from '../types/CharacterWithRelations';

export const useMyCharacter = (
  players: CharacterWithRelations[],
): CharacterWithRelations | undefined => {
  const userId = useAtomValue(authAtom);
  const isAllDataAvailable = userId && players?.length;

  return isAllDataAvailable ? players.find((player) => player.userId === userId) : undefined;
};
