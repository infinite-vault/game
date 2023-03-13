import { useMutation, useQuery } from '@apollo/client';
import { Box } from '@mui/material';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Fights } from '../../components/Game/Fights';
import { Players } from '../../components/Game/Players';
import { Tiles } from '../../components/Game/tiles/Tiles';
import { END_GAME } from '../../graphql/mutations';
import { GET_GAME, GET_PLAYERS } from '../../graphql/queries';
import { UPDATE_GAME_SUBSCRIPTION, UPDATE_PLAYER_SUBSCRIPTION } from '../../graphql/subscriptions';
import { RoutePaths } from '../../routing/AppRoutes';
import { Character } from '../../types/Character';

export const GamePage = () => {
  const { gameId } = useParams();
  // TODO: show proper players loading error
  const { data: gameData, subscribeToMore: gameSubscribeToMore } = useQuery(GET_GAME, {
    variables: { gameId },
    fetchPolicy: 'cache-and-network',
  });
  const { data: playersData, subscribeToMore: playersSubscribeToMore } = useQuery(GET_PLAYERS, {
    variables: { gameId },
    fetchPolicy: 'cache-and-network',
  });
  const [endGame] = useMutation(END_GAME);
  const navigate = useNavigate();

  if (!gameId) {
    navigate(RoutePaths.DASHBOARD);
  }

  const players = playersData?.players || [];
  const isGameQueryConnected = !!gameData?.game;
  const isPlayersQueryConnected = !!playersData?.players;

  useEffect(() => {
    if (isGameQueryConnected) {
      gameSubscribeToMore({
        document: UPDATE_GAME_SUBSCRIPTION,
        variables: { gameId },
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data) {
            return prev;
          }

          return { game: { ...prev.game, ...subscriptionData.data.updateGame } };
        },
      });
    }
  }, [isGameQueryConnected]);

  useEffect(() => {
    if (isPlayersQueryConnected) {
      playersSubscribeToMore({
        document: UPDATE_PLAYER_SUBSCRIPTION,
        variables: { gameId },
        updateQuery: (prev, { subscriptionData }) => {
          if (!Object.keys(prev || {}).length) {
            return { players: [] };
          }

          if (!subscriptionData.data?.updatePlayer) {
            return prev;
          }

          const updatePlayer = subscriptionData.data.updatePlayer as Character;
          const isNewPlayer = prev.players.findIndex((player: Character) => player.id === updatePlayer.id) === -1;
          const updatedPlayers = prev.players.map((char: Character) =>
            char.id === updatePlayer.id ? { ...char, ...updatePlayer } : char,
          );

          if (isNewPlayer) {
            updatedPlayers.push(updatePlayer);
          }

          return {
            players: updatedPlayers,
          };
        },
      });
    }
  }, [isPlayersQueryConnected]);

  useEffect(() => {
    // TODO: find better way to get offline!!!
    const endGameCallback = () => endGame({ variables: { gameId } });
    window.addEventListener('beforeunload', endGameCallback);

    return () => {
      window.removeEventListener('beforeunload', endGameCallback);
      endGameCallback();
    };
  }, []);

  if (!gameData?.game) {
    return <Box>Spiel wird geladen...</Box>;
  }

  return (
    <Box sx={{ position: 'relative', backgroundColor: '#232a36' }}>
      <Tiles gameId={gameId as string} players={players} />
      <Players gameId={gameId as string} players={players} />
      <Fights gameId={gameId as string} />
    </Box>
  );
};
