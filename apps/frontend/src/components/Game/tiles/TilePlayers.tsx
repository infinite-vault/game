import { useAtomValue } from 'jotai';
import { authAtom } from '../../../store/authState';
import { CharacterWithRelations } from '../../../types/CharacterWithRelations';
import { TilePlayer } from './TilePlayer';

interface TilePlayersProps {
  players: CharacterWithRelations[];
  gameId: string;
}

export const TilePlayers = ({ gameId, players }: TilePlayersProps) => {
  const userId = useAtomValue(authAtom);

  // TODO: move isMe into TilePlayer and use useMyCharacter hook
  return (
    <>
      {players.map((player) => (
        <TilePlayer
          key={`player-${player.id}`}
          player={player as any}
          gameId={gameId}
          isMe={player.userId === userId}
        />
      ))}
    </>
  );
};
