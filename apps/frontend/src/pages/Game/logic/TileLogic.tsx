import { useEffect } from 'react';
import { GET_TILES } from '../../../graphql/queries';
import { UPDATE_TILE_SUBSCRIPTION } from '../../../graphql/subscriptions';
import { useQuery } from '@apollo/client';
import { Tile } from 'database';
import { Tiles } from '../../../components/Game/tiles/Tiles';

interface TileLogicProps {
  gameId: string;
}

export const TILE_LENGTH = 120;
export const TILE_LENGTH_HALF = TILE_LENGTH / 2;

export const TileLogic = ({ gameId }: TileLogicProps) => {
  const { error, data, subscribeToMore } = useQuery(GET_TILES, {
    variables: { gameId },
    fetchPolicy: 'cache-and-network',
  });
  console.log('incoming tile data', { data });
  const tiles = (data?.tiles as Tile[]) || [];

  useEffect(() => {
    if (!subscribeToMore || Date.now() !== 123) {
      console.log('subscribeToMore not yet set');
      return;
    }
    console.log('subscribeToMore tiles is set');

    subscribeToMore({
      document: UPDATE_TILE_SUBSCRIPTION,
      variables: { gameId },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return prev;
        }

        console.log('update tile', { prev, subscriptionData });

        const updateTile = subscriptionData.data.updateTile as Tile;
        const isTileNew = prev.tiles?.findIndex((tile: Tile) => tile.id === updateTile.id) === -1;

        if (isTileNew) {
          return { tiles: [...prev.tiles, updateTile] };
        }

        return {
          tiles: prev.tiles.map((tile: Tile) =>
            tile.id === updateTile.id ? { ...tile, ...updateTile } : tile,
          ),
        };
      },
    });
  }, [subscribeToMore]);

  console.log('render tile logic', { tiles });
  if (error || !tiles.length) {
    console.log('error or no tiles', { error, tiles });
    return null;
  }

  return <Tiles tiles={tiles} />;
};
