import { useQuery } from '@apollo/client';
import { GET_PLAYERS } from '../../../graphql/queries';
import { TilePlayers } from '../../../components/Game/tiles/TilePlayers';

interface PlayerStageLogicProps {
  gameId: string;
}

export const PlayerStageLogic = ({ gameId }: PlayerStageLogicProps) => {
  const { data, loading, error } = useQuery(GET_PLAYERS, {
    variables: { gameId },
    fetchPolicy: 'cache-only',
  });
  const players = data?.players || [];

  if (loading || error || !players.length) {
    if (error) {
      console.error('PlayerStageLogic error', { error, gameId });
    }

    return null;
  }

  return <TilePlayers players={players} gameId={gameId} />;
};
