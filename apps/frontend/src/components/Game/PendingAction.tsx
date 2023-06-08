import { useMutation, useQuery } from '@apollo/client';
import { Box, Button, Divider, Typography } from '@mui/material';
import { ATTACK } from '../../graphql/mutations';
import { GET_PLAYERS } from '../../graphql/queries';
import { useMyCharacter } from '../../hooks/useMyCharacter';
import { CharacterWithRelations } from '../../types/CharacterWithRelations';
import { ActionWithRelations } from '../../types/ActionWithRelations';

interface PendingActionProps {
  action: ActionWithRelations;
  gameId: string;
}

export const PendingAction = ({ action, gameId }: PendingActionProps) => {
  const [attack] = useMutation(ATTACK);
  const { data: playersData } = useQuery(GET_PLAYERS, {
    variables: { gameId: gameId },
    fetchPolicy: 'cache-only',
  });

  const players = playersData?.players as CharacterWithRelations[];
  const me = useMyCharacter(players);

  console.log('ActiveFight', { playersData, action, me });

  if (!players) {
    return null;
  }

  const getPlayer = (id: number) => players.find((player) => player.id === id);

  return (
    <Box>
      <Box sx={{ mt: '20px' }}>
        <Box>NPC + Stats</Box>
        <Box>Player + Stats</Box>
        <Button variant="outlined" onClick={() => attack({ variables: { actionId: action.id } })}>
          Attack
        </Button>
        {/* <Box>
          Monster Stats: HP: {fights[0].enemy.stats.hp}/{fights[0].enemy.stats.hpMax}, MANA,
          KONDITION
        </Box>

        <Divider />

        {fights.map((fight) => {
          const player = getPlayer(fight.characterId);
          const isMe = player === me;

          return player ? (
            <Box key={`active-fight-${fight.id}-${player.id}`}>
              <Typography>
                {player.name} {isMe ? ' (me)' : ''}
              </Typography>
              <Box>
                My Stats: EP: {me?.stats.ep}, HP: {me?.stats.hp}/{me?.stats.hpMax}, MANA, KONDITION
              </Box>
              <Box>Ausrüstungswahl: Schwert, Bogen, Zauber...</Box>
              {fight.isPending && (
                <Box>Fight is happening right now with lots of blood and broken bones!!!</Box>
              )}
              {fight.diff && <Box>Diff: {JSON.stringify(fight.diff)}</Box>}
              <Divider />
              {isMe && !fight.attack ? (
                <Box sx={{ py: '10px' }}>
                  <Button
                    onClick={() => attack({ variables: { fightId: fight.id } })}
                    variant="contained"
                    size="small"
                  >
                    Attacke
                  </Button>
                </Box>
              ) : null}
              <Divider />
              {fight.attack && <pre>{JSON.stringify(fight.attack)}</pre>}
              {fight.history.length > 0 && <pre>{JSON.stringify(fight.history)}</pre>}
            </Box>
          ) : (
            <Box>Player nicht gefunden</Box>
          );
        })} */}
        {/* {loading ? (
          <Box>Loading...</Box>
        ) : (
          <Box sx={{ py: '10px' }}>
            <Button onClick={() => attack({ variables: { fightId: fight.id } })} variant="contained" size="small">
              Attacke
            </Button>{' '}
            <Button onClick={() => console.log('FLIGHT')} variant="outlined" size="small">
              Flucht
            </Button>
          </Box>
        )} */}
        <Divider />
        {/* <FightHistory history={fight.history} /> */}
      </Box>
    </Box>
  );
};
