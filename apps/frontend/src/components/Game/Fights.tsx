import { useQuery } from '@apollo/client';
import { Box, Typography } from '@mui/material';
import { useEffect } from 'react';
import { GET_FIGHTS } from '../../graphql/queries';
import { UPDATE_FIGHT_SUBSCRIPTION } from '../../graphql/subscriptions';
import { Fight } from '../../types/Fight';
import { groupBy } from '../../utils/groupBy';
import { sortById } from '../../utils/sortById';
import { ActiveFight } from './ActiveFight';
import { StatsDiff } from './utils/getStatsDiff';

interface FightsProps {
  gameId: string;
}

export interface FightDiff {
  [key: number]: StatsDiff;
}

export const Fights = ({ gameId }: FightsProps) => {
  const { data, loading, subscribeToMore } = useQuery(GET_FIGHTS, { variables: { gameId } });
  const fights = data?.fights as Fight[];

  // const fights = useMemo<Fight[]>(() => {
  //   console.log('useMemo fights', data?.fights);
  //   return data?.fights ? (data.fights as Fight[]).map((fight) => ({ ...fight, diff: undefined })) : [];
  // }, [data?.fights]);

  console.log('Fights', { fights });

  useEffect(() => {
    console.log('subscribe to fights');

    subscribeToMore({
      document: UPDATE_FIGHT_SUBSCRIPTION,
      variables: { gameId },
      updateQuery: (prev, { subscriptionData }) => {
        if (Object.keys(prev || {}).length === 0) {
          return { fights: [] };
        }

        if (!subscriptionData.data) {
          return prev;
        }

        const updatedFight = subscriptionData.data.updateFight as Fight;

        console.log('sub incoming', { updatedFight, prev });
        const existingFight = prev.fights.find((fight: Fight) => fight.id === updatedFight.id);

        // if (existingFight) {
        //   const addDiff = getStatsDiff(existingFight.enemy.stats, updatedFight.enemy.stats);
        //   setDiff({ ...diff, [updatedFight.characterId]: addDiff });
        // }

        const updatedFights = prev.fights.map((fight: Fight) =>
          fight.id === updatedFight.id ? { ...fight, ...updatedFight } : fight,
        );

        if (!existingFight) {
          updatedFights.push(updatedFight);
        }

        return { fights: updatedFights.sort(sortById) };
      },
    });
  }, []);

  if (loading) {
    return <Box>Loading...</Box>;
  }

  if (!fights || !Array.isArray(fights) || !fights.length) {
    return null;
  }

  const renderGroupedFights = () => {
    const groupedFightsByEnemy = groupBy(fights, ({ enemy: { id } }: any) => id);
    const results = [];

    for (const [enemyId, groupedFights] of groupedFightsByEnemy) {
      if (groupedFights[0].isOver) {
        results.push(
          <Box key={`fight-over-${enemyId}`}>Fight is over {groupedFights.map(({ id }: any) => id).join(', ')}</Box>,
        ); // <WonFight key={`fight-won-${fight.id}`} fight={groupedFights} />;
      } else {
        results.push(<ActiveFight key={`fight-${enemyId}`} fights={groupedFights} />);
      }
    }

    return results;
  };

  return (
    <Box
      sx={{ position: 'absolute', top: '10px', left: '10px', p: '10px', width: '40vw', backgroundColor: 'lightgray' }}
    >
      <Typography>It's fight time!!!</Typography>
      {renderGroupedFights()}
    </Box>
  );
};
