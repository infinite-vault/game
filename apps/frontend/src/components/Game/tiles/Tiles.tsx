import { useMemo } from 'react';
import { Vector2d } from 'konva/lib/types';
import { VisibleTile } from './VisibleTile';
import { HiddenTile } from './HiddenTile';
import { Tile } from 'database';
import { getHiddentTiles } from '../utils/getHiddenTiles';

interface TilesProps {
  tiles: Tile[];
}

export const Tiles = ({ tiles }: TilesProps) => {
  const hiddenTiles: Vector2d[] = useMemo(() => getHiddentTiles(tiles), [tiles]);

  console.log('render tiles', { tiles, hiddenTiles });

  return (
    <>
      {hiddenTiles.map(({ x, y }) => (
        <HiddenTile key={`tile-hidden-${x}-${y}`} x={x} y={y} />
      ))}

      {tiles.map((tile) => (
        <VisibleTile key={`tile-visible-${tile.id}`} x={tile.x} y={tile.y} type={tile.type} />
      ))}
    </>
  );
};
