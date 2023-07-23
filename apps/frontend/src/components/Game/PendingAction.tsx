import { Box, Button, Divider, Typography } from '@mui/material';
import { useMyCharacter } from '../../hooks/useMyCharacter';
import { ActionWithRelations } from '../../types/ActionWithRelations';
import { useAtomValue } from 'jotai';
import { charactersAtom } from '../../store/game/charactersAtom';
import useAxios from 'axios-hooks';
import { ApiPath } from 'types';

interface PendingActionProps {
  action: ActionWithRelations;
  gameId: string;
}

export const PendingAction = ({ action, gameId }: PendingActionProps) => {
  const characters = useAtomValue(charactersAtom);
  const me = useMyCharacter(characters);
  const [_, execute] = useAxios(
    { url: ApiPath.PREPARE_ATTACK, params: { actionId: action.id, gameId } },
    {
      manual: true,
    },
  );

  console.log('ActiveFight', { characters, action, me });

  if (!characters) {
    return null;
  }

  return (
    <Box>
      <Box sx={{ mt: '20px' }}>
        <Box>NPC + Stats</Box>
        <Box>Player + Stats</Box>

        {action.type === 'PENDING' ? (
          <Button variant="outlined" onClick={() => execute()}>
            Attack
          </Button>
        ) : null}

        {action.type === 'OVER' ? (
          <Box>
            <Typography>Fight is over</Typography>
          </Box>
        ) : null}

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
