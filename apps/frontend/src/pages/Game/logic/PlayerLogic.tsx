import { useQuery } from '@apollo/client';
import { GET_PLAYERS } from '../../../graphql/queries';
import { useEffect } from 'react';
import { UPDATE_PLAYER_SUBSCRIPTION } from '../../../graphql/subscriptions';
import { merge } from 'lodash';
import { Players } from '../../../components/Game/Players';
import { TilePlayers } from '../../../components/Game/tiles/TilePlayers';

interface PlayerLogicProps {
  gameId: string;
}

export const PlayerLogic = ({ gameId }: PlayerLogicProps) => {
  const { data, loading, error, subscribeToMore } = useQuery(GET_PLAYERS, {
    variables: { gameId },
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    console.log('PlayerLogic subscribeToMore', { gameId });

    if (subscribeToMore) {
      subscribeToMore({
        document: UPDATE_PLAYER_SUBSCRIPTION,
        variables: { gameId },
        updateQuery: (prev, { subscriptionData }) => {
          if (!Object.keys(prev || {}).length) {
            return { players: [] };
          }

          if (!subscriptionData.data?.updatePlayer) {
            return prev;
          }

          const updatePlayer = subscriptionData.data.updatePlayer as any;
          const isNewPlayer =
            prev.players.findIndex((player: any) => player.id === updatePlayer.id) === -1;
          const updatedPlayers = prev.players.map((char: any) =>
            char.id === updatePlayer.id ? merge({}, char, updatePlayer) : char,
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
  }, [subscribeToMore]);

  if (loading || error || !data?.players) {
    if (error) {
      console.error('PlayerLogic error', { error, gameId });
    }

    return null;
  }

  return (
    <>
      <TilePlayers players={data.players} gameId={gameId} />
      <Players gameId={gameId} players={data.players} />
    </>
  );
};
