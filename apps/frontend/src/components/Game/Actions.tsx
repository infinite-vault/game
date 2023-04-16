import { Action } from 'database';
import { StatsDiff } from './utils/getStatsDiff';
import { Box, Typography } from '@mui/material';

interface ActionsProps {
  actions: Action[];
}

export interface ActionDiff {
  [key: number]: StatsDiff;
}

export const Actions = ({ actions }: ActionsProps) => {
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

  return (
    <Box>
      <Typography>It's fight time!!!</Typography>
      <ul>
        {actions.map((action) => (
          <li>#{action.id}</li>
        ))}
      </ul>
      {/* {renderGroupedFights()} */}
    </Box>
  );
};
