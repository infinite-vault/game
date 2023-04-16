import { useMutation } from '@apollo/client';
import { Box } from '@mui/material';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { END_GAME } from '../../graphql/mutations';
import { RoutePaths } from '../../routing/AppRoutes';
import { GameLogic } from './logic/GameLogic';
import { PlayerStageLogic } from './logic/PlayerStageLogic';
import { ActionLogic } from './logic/ActionLogic';
import { StageLogic } from './logic/StageLogic';
import { PlayerLogic } from './logic/PlayerLogic';
import { TileLogic } from './logic/TileLogic';
import { Navigation } from '../../components/Navigation/Navigation';

export const GamePage = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();

  if (!gameId) {
    navigate(RoutePaths.DASHBOARD);
    return null;
  }

  const [endGame] = useMutation(END_GAME);
  // useSubscription(TRIGGER_REFETCH_SUBSCRIPTION, {
  //   onData: ({ data: d }: any) => {
  //     console.info('refetchSubscription', { d });

  //     if (d.refetch?.query) {
  //       apolloClient.refetchQueries({ include: [d.refetch.query] });
  //     }
  //   },
  // });

  useEffect(() => {
    const endGameCallback = async () => {
      try {
        await endGame({ variables: { gameId } });
      } catch (err) {
        console.error('error ending game', err);
      }
    };

    window.addEventListener('beforeunload', endGameCallback);

    return () => {
      window.removeEventListener('beforeunload', endGameCallback);
      endGameCallback();
    };
  }, []);

  return (
    <Box sx={{ position: 'relative', backgroundColor: '#232a36' }}>
      <StageLogic>
        <TileLogic gameId={gameId} />
        <PlayerStageLogic gameId={gameId} />
      </StageLogic>

      <Navigation />
      <GameLogic gameId={gameId} />
      <ActionLogic gameId={gameId} />
      <PlayerLogic gameId={gameId} />
    </Box>
  );
};
