import { Box, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { CharacterStageLogic } from './logic/PlayerStageLogic';
import { ActionLogic } from './logic/ActionLogic';
import { StageLogic } from './logic/StageLogic';
import { CharacterLogic } from './logic/PlayerLogic';
import { TileLogic } from './logic/TileLogic';
import { Navigation } from '../../components/Navigation/Navigation';
import { useAtomValue } from 'jotai';
import { navAtom } from '../../store/navState';
import { Suspense, useEffect } from 'react';
import { ApiPath, SocketEvent } from 'types';
import { GameState, useGameState } from '../../hooks/useGameState';
import { useSync } from '../../hooks/useSync';
import { Character, Tile } from 'database';
import { charactersAtom } from '../../store/game/charactersAtom';
import { actionsAtom } from '../../store/game/actionsAtom';
import { tilesAtom } from '../../store/game/tilesAtom';
import { RoutePaths } from '../../routing/AppRoutes';
import { ActionWithRelations } from '../../types/ActionWithRelations';
import { gameAtom } from '../../store/game/gameState';
import { CharacterWithRelations } from '../../types/CharacterWithRelations';

interface GameProps {
  gameId: string;
}

export const GamePage = () => {
  const navigate = useNavigate();
  const { gameId = '' } = useParams();
  const { gameState } = useGameState(gameId);

  useEffect(() => {
    if (!gameId) {
      navigate(RoutePaths.DASHBOARD);
    }
  }, [gameId]);

  if (gameState === GameState.OFFLINE) {
    return <Box>Connection lost</Box>;
  }

  return <Game gameId={gameId} />;
};

const Game = ({ gameId }: GameProps) => {
  const navState = useAtomValue(navAtom);
  const game = useAtomValue(gameAtom);

  useSync<CharacterWithRelations>({
    atom: charactersAtom,
    url: ApiPath.GET_CHARACTERS_BY_GAME_ID,
    params: { gameId },
    socketEvent: SocketEvent.CHARACTER_UPDATE,
    socketFullUpdateEvent: SocketEvent.CHARACTER_FULL_UPDATE,
  });

  useSync<Tile>({
    atom: tilesAtom,
    url: ApiPath.GET_TILES_BY_GAME_ID,
    params: { gameId },
    socketEvent: SocketEvent.TILE_UPDATE,
    socketFullUpdateEvent: SocketEvent.TILE_FULL_UPDATE,
  });

  useSync<ActionWithRelations>({
    atom: actionsAtom,
    url: ApiPath.GET_ACTIONS_BY_GAME_ID,
    params: { gameId },
    socketEvent: SocketEvent.ACTION_UPDATE,
    socketFullUpdateEvent: SocketEvent.ACTION_FULL_UPDATE,
  });

  // const [endGame] = useMutation(END_GAME);

  // useEffect(() => {
  //   const endGameCallback = async () => {
  //     try {
  //       await endGame({ variables: { gameId } });
  //     } catch (err) {
  //       console.error('error ending game', err);
  //     }
  //   };

  //   window.addEventListener('beforeunload', endGameCallback);

  //   return () => {
  //     window.removeEventListener('beforeunload', endGameCallback);
  //     endGameCallback();
  //   };
  // }, []);

  return (
    <Box sx={{ position: 'relative', backgroundColor: '#232a36' }}>
      <StageLogic>
        <Suspense>
          <TileLogic />
        </Suspense>
        <Suspense>
          <CharacterStageLogic gameId={gameId} />
        </Suspense>
      </StageLogic>

      <Navigation />

      <Box sx={{ position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)' }}>
        <Typography>
          {game?.name} - {navState}
        </Typography>
      </Box>

      <ActionLogic gameId={gameId} />
      <CharacterLogic gameId={gameId} />
    </Box>
  );
};
