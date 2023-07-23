import { Tiles } from '../../../components/Game/tiles/Tiles';
import { useAtomValue } from 'jotai';
import { tilesAtom } from '../../../store/game/tilesAtom';

export const TILE_LENGTH = 120;
export const TILE_LENGTH_HALF = TILE_LENGTH / 2;

export const TileLogic = () => {
  const tiles = useAtomValue(tilesAtom);

  if (!tiles.length) {
    return null;
  }

  return <Tiles tiles={tiles} />;
};
