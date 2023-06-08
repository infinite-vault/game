import { Prisma } from 'database';
import { StatsDiff } from './utils/getStatsDiff';
import { Box, Typography } from '@mui/material';
import { useMyCharacter } from '../../hooks/useMyCharacter';
import { useQuery } from '@apollo/client';
import { GET_PLAYERS } from '../../graphql/queries';
import { ActionWithRelations } from '../../types/ActionWithRelations';
import { CharacterWithRelations } from '../../types/CharacterWithRelations';
import { memo, useMemo } from 'react';
import { PendingAction } from './PendingAction';

interface ActionsProps {
  actions: ActionWithRelations[];
  gameId: string;
}

interface ActionSplit {
  myAction: ActionWithRelations | null;
  otherActions: ActionWithRelations[];
}

export interface ActionDiff {
  [key: number]: StatsDiff;
}

export const Actions = ({ actions, gameId }: ActionsProps) => {
  const { data: playersData } = useQuery(GET_PLAYERS, {
    variables: { gameId },
    fetchPolicy: 'cache-only',
  });

  const players = playersData?.players as CharacterWithRelations[];
  const me = useMyCharacter(players);

  // const renderGroupedFights = () => {
  //   const groupedFightsByEnemy = groupBy(actions, ({ enemy: { id } }: any) => id);
  //   const results = [];
  //   for (const [enemyId, groupedFights] of groupedFightsByEnemy) {
  //     if (groupedFights[0].isOver) {
  //       results.push(
  //         <Box key={`fight-over-${enemyId}`}>
  //           Fight is over {groupedFights.map(({ id }: any) => id).join(', ')}
  //         </Box>,
  //       ); // <WonFight key={`fight-won-${fight.id}`} fight={groupedFights} />;
  //     } else {
  //       results.push(<ActiveFight key={`fight-${enemyId}`} fights={groupedFights} />);
  //     }
  //   }
  //   return results;
  // };

  const { myAction, otherActions } = actions.reduce(
    (acc, action) => {
      const isMe = me && action.characters.some((character) => character.id === me.id);
      if (isMe) {
        acc['myAction'] = action;
      } else {
        acc['otherActions'].push(action);
      }

      return acc;
    },
    { myAction: null, otherActions: [] } as ActionSplit,
  );

  if (!players || !me) {
    return null;
  }

  return (
    <Box>
      <Typography>It's fight time!!!</Typography>
      {myAction ? <PendingAction action={myAction} gameId={gameId} /> : null}

      {otherActions.length > 0 ? (
        <Box sx={{ mt: '30px' }}>
          <div>Other actions</div>
          <ul>
            {otherActions.map((action) => (
              <li key={action.id}>#{action.id}</li>
            ))}
          </ul>
        </Box>
      ) : null}
      {/* {renderGroupedFights()} */}
    </Box>
  );
};
