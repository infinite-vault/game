import { useMutation, useSubscription } from '@apollo/client';
import { Box } from '@mui/material';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { END_GAME } from '../../graphql/mutations';
import { RoutePaths } from '../../routing/AppRoutes';
import { GameLogic } from './logic/GameLogic';
import { PlayerLogic } from './logic/PlayerLogic';
import { ActionLogic } from './logic/ActionLogic';
import { TRIGGER_REFETCH_SUBSCRIPTION } from '../../graphql/subscriptions';
import { apolloClient } from '../../graphql/apolloClient';
import { StageLogic } from './logic/StageLogic';

export const GamePage = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();

  if (!gameId) {
    navigate(RoutePaths.DASHBOARD);
    return null;
  }

  const [endGame] = useMutation(END_GAME);
  useSubscription(TRIGGER_REFETCH_SUBSCRIPTION, {
    onData: ({ data: d }: any) => {
      console.info('refetchSubscription', { d });

      if (d.refetch?.query) {
        apolloClient.refetchQueries({ include: [d.refetch.query] });
      }
    },
  });

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
        <GameLogic gameId={gameId as string} />
        <PlayerLogic gameId={gameId as string} />
        <ActionLogic gameId={gameId as string} />
      </StageLogic>
    </Box>
  );
};
