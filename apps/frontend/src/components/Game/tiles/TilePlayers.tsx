import { useAtomValue } from 'jotai';
import { authAtom } from '../../../store/authState';
import { TilePlayer } from './TilePlayer';
import { Character } from 'database';

interface TileCharactersProps {
  characters: Character[];
  gameId: string;
}

export const TileCharacters = ({ gameId, characters }: TileCharactersProps) => {
  const userId = useAtomValue(authAtom);

  // TODO: move isMe into TilePlayer and use useMyCharacter hook
  return (
    <>
      {characters.map((character) => (
        <TilePlayer
          key={`character-${character.id}`}
          player={character as any}
          gameId={gameId}
          isMe={character.userId === userId}
        />
      ))}
    </>
  );
};
