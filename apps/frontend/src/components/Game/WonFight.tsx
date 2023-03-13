import { useQuery } from '@apollo/client';
import { Box, Typography } from '@mui/material';
import { GET_PLAYERS } from '../../graphql/queries';
import { useMyCharacter } from '../../hooks/useMyCharacter';
import { Character } from '../../types/Character';
import { Fight as FightType } from '../../types/Fight';
import { FightHistory } from './FightHistory';

interface WonFightProps {
  fight: FightType;
}

export const WonFight = ({ fight }: WonFightProps) => {
  const { data: playersData } = useQuery(GET_PLAYERS, {
    variables: { gameId: fight.gameId },
    fetchPolicy: 'cache-only',
  });

  const players = playersData?.players as Character[];
  const me = useMyCharacter(players);

  return (
    <Box>
      <Typography>Gewonnen!!! {fight.id}</Typography>
      {players.map((character) => {
        return (
          <Box key={`won-fight-${fight.id}`} sx={{ mt: '20px' }}>
            <Typography>
              {character.name} {character === me ? ' (me)' : ''} vs {fight.enemy.name}
            </Typography>
            <Box>Me & Monster Stats: EP, HP, MANA, KONDITION</Box>
            <Box>Ausrüstungswahl: Schwert, Bogen, Zauber...</Box>
            <FightHistory history={fight.history} />
          </Box>
        );
      })}
    </Box>
  );
};
