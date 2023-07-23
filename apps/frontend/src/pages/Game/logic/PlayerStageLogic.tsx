import { TileCharacters } from '../../../components/Game/tiles/TilePlayers';
import { useAtomValue } from 'jotai';
import { charactersAtom } from '../../../store/game/charactersAtom';

interface CharacterStageLogicProps {
  gameId: string;
}

export const CharacterStageLogic = ({ gameId }: CharacterStageLogicProps) => {
  const characters = useAtomValue(charactersAtom);

  if (!characters?.length) {
    return null;
  }

  return <TileCharacters characters={characters} gameId={gameId} />;
};
