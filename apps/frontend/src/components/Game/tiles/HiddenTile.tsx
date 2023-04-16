import { Rect } from 'react-konva';
import { getCoordinate } from '../../../utils/getCoordinate';
import { TILE_LENGTH } from '../../../pages/Game/logic/TileLogic';

interface HiddenTileProps {
  x: number;
  y: number;
}

export const HiddenTile = ({ x, y }: HiddenTileProps) => {
  return (
    <Rect
      x={getCoordinate(x)}
      y={getCoordinate(y)}
      width={TILE_LENGTH}
      height={TILE_LENGTH}
      stroke="#444"
    />
  );
};
