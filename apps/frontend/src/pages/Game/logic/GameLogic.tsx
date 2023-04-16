import { useQuery } from '@apollo/client';
import { GET_GAME } from '../../../graphql/queries';
import { useEffect } from 'react';
import { UPDATE_GAME_SUBSCRIPTION } from '../../../graphql/subscriptions';
import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { RoutePaths } from '../../../routing/AppRoutes';

interface GameLogicProps {
  gameId: string;
}

export const GameLogic = ({ gameId }: GameLogicProps) => {
  const navigate = useNavigate();
  const { data, loading, error, subscribeToMore } = useQuery(GET_GAME, {
    variables: { gameId },
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    if (subscribeToMore) {
      console.log('subscribeToMore', { gameId });

      subscribeToMore({
        document: UPDATE_GAME_SUBSCRIPTION,
        variables: { gameId },
      });
    }
  }, [subscribeToMore]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error || !data?.game.id) {
    // TODO add proper error handling - visble to user
    console.error('GameLogic error', { error, gameId });
    navigate(RoutePaths.DASHBOARD);
  }

  return (
    <Box sx={{ position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)' }}>
      <Typography>{data?.game?.name} </Typography>
    </Box>
  );
};
