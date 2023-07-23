import { Box, Button, Chip, Typography } from '@mui/material';
import { useAtomValue } from 'jotai';
import { useMyCharacter } from '../../hooks/useMyCharacter';
import { stageAtom } from '../../store/stageState';
import { CharacterConnection, CharacterWithRelations } from '../../types/CharacterWithRelations';
import { sortByName } from '../../utils/sortByName';

interface CharactersProps {
  gameId: string;
  players: CharacterWithRelations[];
}

export const Characters = ({ gameId, players }: CharactersProps) => {
  const stage = useAtomValue(stageAtom);
  const me = useMyCharacter(players);

  if (!me || !players || players.length === 0) {
    return null;
  }

  return (
    <Box>
      <Typography>Players</Typography>

      {/* {stage && me ? (
        <Button
          size="small"
          onClick={() =>
            stage.position({
              x: stage.width() / 2 - getCoordinate(me.tile?.x as number) - TILE_LENGTH_HALF,
              y: stage.height() / 2 - getCoordinate(me.tile?.y as number) - TILE_LENGTH_HALF,
            })
          }
        >
          (focus)
        </Button>
      ) : null} */}

      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        {[...(players || [])].sort(sortByName).map((player: CharacterWithRelations) => (
          <Box sx={{ mt: '14px' }} key={`${player}-${player.id}`}>
            <Box>
              {player.name} {me === player ? '(me)' : ''}
            </Box>
            <Box>
              Level: {player.stats?.level} - EP: {player.stats?.ep} - HP: {player.stats?.hp}/
              {player.stats?.hpMax} - Mana: {player.stats?.mana}/{player.stats?.manaMax} - Ausdauer:{' '}
              {player.stats?.endurance}/{player.stats?.enduranceMax}
            </Box>
            <Box>
              <Chip
                size="small"
                color={player.connection === CharacterConnection.ONLINE ? 'success' : 'primary'}
                variant={player.connection === CharacterConnection.OFFLINE ? 'outlined' : 'filled'}
                label={player.connection}
              />
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};
