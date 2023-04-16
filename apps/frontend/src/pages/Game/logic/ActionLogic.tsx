import { useQuery } from '@apollo/client';
import { GET_ACTIONS } from '../../../graphql/queries';
import { Action } from 'database';
import { useEffect } from 'react';
import { UPDATE_ACTION_SUBSCRIPTION } from '../../../graphql/subscriptions';

interface ActionLogicProps {
  gameId: string;
}

export const ActionLogic = ({ gameId }: ActionLogicProps) => {
  const { data, loading, subscribeToMore } = useQuery(GET_ACTIONS, { variables: { gameId } });
  const actions = data?.actions as Action[];

  // const fights = useMemo<Fight[]>(() => {
  //   console.log('useMemo fights', data?.fights);
  //   return data?.fights ? (data.fights as Fight[]).map((fight) => ({ ...fight, diff: undefined })) : [];
  // }, [data?.fights]);

  console.log('Actions', { fights: actions });

  useEffect(() => {
    console.log('subscribe to fights');

    subscribeToMore({
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
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!actions || !Array.isArray(actions) || !actions.length) {
    return null;
  }

  return (
    <div>
      <h1>ActionLogic</h1>
      <p>Find me in ./web/src/pages/Game/logic/ActionLogic.tsx</p>
      {/* <Actions gameId={gameId as string} /> */}
    </div>
  );
};
