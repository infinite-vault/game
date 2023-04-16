import { Tile } from 'database';
import { Vector2d } from 'konva/lib/types';

export const getHiddentTiles = (tiles: Tile[]) => {
  const hiddenTilesTemp: { [key: string]: boolean | Vector2d } = {};

  const setPossibleHiddenTile = (x: number, y: number) => {
    if (hiddenTilesTemp[`${x}:${y}`] !== false) {
      hiddenTilesTemp[`${x}:${y}`] = { x, y } as Vector2d;
    }
  };

  const removeVisibleTiles = () => {
    for (const item in hiddenTilesTemp) {
      if (hiddenTilesTemp[item] === false) {
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
};
