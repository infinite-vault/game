import { useQuery } from '@apollo/client';
import { GET_ACTIONS, GET_PLAYERS } from '../../../graphql/queries';
import { useEffect } from 'react';
import { UPDATE_ACTION_SUBSCRIPTION } from '../../../graphql/subscriptions';
import { navAtom } from '../../../store/navState';
import { useAtomValue } from 'jotai';
import { NavState } from '../../../types/NavState';
import { Actions } from '../../../components/Game/Actions';
import { ContentContainer } from '../../../components/Navigation/ContentContainer';
import { ActionWithRelations } from '../../../types/ActionWithRelations';

interface ActionLogicProps {
  gameId: string;
}

export const ActionLogic = ({ gameId }: ActionLogicProps) => {
  const {
    data: actionData,
    loading,
    subscribeToMore,
  } = useQuery(GET_ACTIONS, { variables: { gameId } });

  const navState = useAtomValue(navAtom);
  const actions = actionData?.actions as ActionWithRelations[];

  // const fights = useMemo<Fight[]>(() => {
  //   console.log('useMemo fights', data?.fights);
  //   return data?.fights ? (data.fights as Fight[]).map((fight) => ({ ...fight, diff: undefined })) : [];
  // }, [d
  console.log('Actions', { fights: actions, data: actionData, subscribeToMore });

  useEffect(() => {
    if (subscribeToMore) {
      console.log('subscribe to fights');
      const unsubscribe = subscribeToMore({
        document: UPDATE_ACTION_SUBSCRIPTION,
        variables: { gameId },
        // updateQuery: (prev, { subscriptionData }) => {
        //   if (Object.keys(prev || {}).length === 0) {
        //     return { fights: [] };
        //   }

        //   if (!subscriptionData.data) {
        //     return prev;
        //   }

        //   const updatedFight = subscriptionData.data.updateFight as Fight;

        //   console.log('sub incoming', { updatedFight, prev });
        //   const existingFight = prev.fights.find((fight: Fight) => fight.id === updatedFight.id);

        //   // if (existingFight) {
        //   //   const addDiff = getStatsDiff(existingFight.enemy.stats, updatedFight.enemy.stats);
        //   //   setDiff({ ...diff, [updatedFight.characterId]: addDiff });
        //   // }

        //   const updatedFights = prev.fights.map((fight: Fight) =>
        //     fight.id === updatedFight.id ? { ...fight, ...updatedFight } : fight,
        //   );

        //   if (!existingFight) {
        //     updatedFights.push(updatedFight);
        //   }

        //   return { fights: updatedFights.sort(sortById) };
        // },
      });

      return () => {
        console.log('unsubscribe from fights');
        unsubscribe();
      };
    }
  }, [subscribeToMore]);

  if (navState !== NavState.FIGHTS || !actions?.length) {
    return null;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <ContentContainer>
      <Actions actions={actions} gameId={gameId} />
    </ContentContainer>
  );
};
