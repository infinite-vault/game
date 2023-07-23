import { navAtom } from '../../../store/navState';
import { useAtomValue } from 'jotai';
import { NavState } from '../../../types/NavState';
import { Actions } from '../../../components/Game/Actions';
import { ContentContainer } from '../../../components/Navigation/ContentContainer';
import { actionsAtom } from '../../../store/game/actionsAtom';

interface ActionLogicProps {
  gameId: string;
}

export const ActionLogic = ({ gameId }: ActionLogicProps) => {
  const navState = useAtomValue(navAtom);
  const actions = useAtomValue(actionsAtom);

  console.log('Actions', { actions });

  if (navState !== NavState.FIGHTS || !actions?.length) {
    return null;
  }

  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  return (
    <ContentContainer>
      <Actions gameId={gameId} />
    </ContentContainer>
  );
};
