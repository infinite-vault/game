import { StatsDiff } from './utils/getStatsDiff';
import { Box, Typography } from '@mui/material';
import { useMyCharacter } from '../../hooks/useMyCharacter';
import { ActionWithRelations } from '../../types/ActionWithRelations';
import { charactersAtom } from '../../store/game/charactersAtom';
import { useAtomValue } from 'jotai';
import { actionsAtom } from '../../store/game/actionsAtom';
import { PendingAction } from './PendingAction';

interface ActionsProps {
  gameId: string;
}

interface ActionSplit {
  myAction: ActionWithRelations | null;
  otherActions: ActionWithRelations[];
}

export interface ActionDiff {
  [key: number]: StatsDiff;
}

export const Actions = ({ gameId }: ActionsProps) => {
  const actions = useAtomValue(actionsAtom);
  const characters = useAtomValue(charactersAtom);
  const me = useMyCharacter(characters);

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

  if (!characters?.length || !me) {
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
    </Box>
  );
};
