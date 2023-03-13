import { Box, Typography } from '@mui/material';
import { FightResults as FightResultsType } from '../../types/Fight';

interface FightResultsProps {
  history: FightResultsType[];
}

export const FightHistory = ({ history }: FightResultsProps) => {
  return history?.length ? (
    <Box>
      <Typography>Spielverlauf</Typography>
      {history.map(({ me, enemy }, idx) => (
        <Box key={`result-${idx}`}>
          <Box>Runde {idx + 1}</Box>
          <Box>
            Player: Würfel: {me.dice}/{me.diceMax} - Schaden: {me.damage}{' '}
          </Box>
          <Box>
            Gegner: Würfel: {enemy.dice}/{enemy.diceMax} - Schaden: {enemy.damage}{' '}
          </Box>
        </Box>
      ))}
    </Box>
  ) : null;
};
