import { useMutation } from '@apollo/client';
import { Box, Button, Chip, Typography } from '@mui/material';
import { useAtomValue } from 'jotai';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SET_GAME_STATE } from '../../graphql/mutations';
import { useMyCharacter } from '../../hooks/useMyCharacter';
import { RoutePaths } from '../../routing/AppRoutes';
import { stageAtom } from '../../store/stageState';
import { CharacterConnection, CharacterWithRelations } from '../../types/Character';
import { getCoordinate } from '../../utils/getCoordinate';
import { sortByName } from '../../utils/sortByName';
import { TILE_LENGTH_HALF } from './tiles/Tiles';

interface PlayerProps {
  gameId: string;
  players: CharacterWithRelations[];
}

export const Players = ({ gameId, players }: PlayerProps) => {
  const [setStatus] = useMutation(SET_GAME_STATE);
  const stage = useAtomValue(stageAtom);
  const me = useMyCharacter(players);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Players CHANGE', { players });
  }, [players]);

  if (!me || !players || players.length === 0) {
    console.log('Players FAIL', { me, players });
    return null;
  }

  const renderStatusButton = () => {
    switch (me?.connection) {
      case CharacterConnection.ONLINE:
        return (
          <Button
            variant="outlined"
            onClick={() =>
              setStatus({ variables: { gameId, connection: CharacterConnection.AFK } })
            }
          >
            AFK
          </Button>
        );
        break;

      case CharacterConnection.AFK:
        return (
          <Button
            variant="outlined"
            onClick={() =>
              setStatus({ variables: { gameId, connection: CharacterConnection.ONLINE } })
            }
          >
            Online
          </Button>
        );
        break;

      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        border: '1px solid grey',
        p: '12px',
        position: 'absolute',
        top: '10px',
        right: '10px',
        backgroundColor: 'lightgray',
        minWidth: '250px',
      }}
    >
      <Typography>Players</Typography>
      {renderStatusButton()}{' '}
      <Button
        variant="outlined"
        color="primary"
        onClick={() => {
          setStatus({ variables: { gameId, connection: CharacterConnection.OFFLINE } });
          navigate(RoutePaths.DASHBOARD);
        }}
      >
        Offline
      </Button>
      {stage && me ? (
        <Button
          size="small"
          onClick={() =>
            stage.position({
              x: stage.width() / 2 - getCoordinate(me.tile?.x as number) - TILE_LENGTH_HALF,
              y: stage.height() / 2 - getCoordinate(me.tile?.y as number) - TILE_LENGTH_HALF,
            })
          }
        >
          (+)
        </Button>
      ) : null}
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
              <Chip
                sx={{ ml: '10px' }}
                size="small"
                color="primary"
                variant="outlined"
                label={player.nextAction}
              />
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};
