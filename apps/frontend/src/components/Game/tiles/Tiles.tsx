import { useEffect, useMemo, useState } from 'react';
import { Vector2d } from 'konva/lib/types';
import { useWindowSize } from '../../../hooks/useWindowSize';
import { isObject } from '../../../utils/isObject';
import { VisibleTile } from './VisibleTile';
import { HiddenTile } from './HiddenTile';
import { Tile } from 'database';
import { useAtomValue } from 'jotai';
import { stageAtom } from '../../../store/stageState';

interface TilesProps {
  tiles: Tile[];
}

export const Tiles = ({ tiles }: TilesProps) => {
  const windowSize = useWindowSize();
  const [isFirstRender, setFirstRender] = useState(true);
  const stage = useAtomValue(stageAtom);
  const hiddenTiles: Vector2d[] = useMemo(() => {
    const hiddenTilesTemp: { [key: string]: boolean | Vector2d } = {};

    const setPossibleHiddenTile = (x: number, y: number) => {
      if (hiddenTilesTemp[`${x}:${y}`] !== false) {
        hiddenTilesTemp[`${x}:${y}`] = { x, y } as Vector2d;
      }
    };

    const removeVisibleTiles = () => {
      for (const item in hiddenTilesTemp) {
        if (isObject(hiddenTilesTemp[item] && hiddenTilesTemp[item] === false)) {
          delete hiddenTilesTemp[item];
        }
      }
    };

    for (const tile of tiles) {
      // active tile is 100% visible
      hiddenTilesTemp[`${tile.x}:${tile.y}`] = false;

      // set all surrounding tiles to hidden if they are not already visible
      setPossibleHiddenTile(tile.x, tile.y + 1);
      setPossibleHiddenTile(tile.x + 1, tile.y);
      setPossibleHiddenTile(tile.x, tile.y - 1);
      setPossibleHiddenTile(tile.x - 1, tile.y);
      setPossibleHiddenTile(tile.x + 1, tile.y + 1);
      setPossibleHiddenTile(tile.x + 1, tile.y - 1);
      setPossibleHiddenTile(tile.x - 1, tile.y - 1);
      setPossibleHiddenTile(tile.x - 1, tile.y + 1);
    }

    removeVisibleTiles();

    return Object.values(hiddenTilesTemp) as Vector2d[];
  }, [tiles]);

  useEffect(() => {
    if (stage && tiles && isFirstRender) {
      console.log('Tiles first render - set center position');
      stage.position({ x: windowSize.width / 2, y: windowSize.height / 2 });
      setFirstRender(false);
    }
  }, [stage, tiles, windowSize, isFirstRender]);

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
