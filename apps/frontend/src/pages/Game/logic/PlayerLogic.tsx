import { Characters } from '../../../components/Game/Players';
import { useAtomValue } from 'jotai';
import { navAtom } from '../../../store/navState';
import { ContentContainer } from '../../../components/Navigation/ContentContainer';
import { NavState } from '../../../types/NavState';
import { charactersAtom } from '../../../store/game/charactersAtom';

interface CharacterLogicProps {
  gameId: string;
}

export const CharacterLogic = ({ gameId }: CharacterLogicProps) => {
  const navState = useAtomValue(navAtom);
  const characters = useAtomValue(charactersAtom);

  if (navState !== NavState.PLAYERS || !characters) {
    return null;
  }

  return (
    <ContentContainer>
      <Characters gameId={gameId} players={characters as any} />
    </ContentContainer>
  );
};
