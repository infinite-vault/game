import { Group, Image, Rect, Text } from 'react-konva';
import useImage from 'use-image';
import { getCoordinate } from '../../../utils/getCoordinate';
import { TILE_LENGTH } from './Tiles';

interface VisibleTileProps {
  x: number;
  y: number;
  type: string;
}

export const VisibleTile = ({ x, y, type }: VisibleTileProps) => {
  const [image] = useImage('/images/monster.png');

  return (
    <Group x={getCoordinate(x)} y={getCoordinate(y)} width={TILE_LENGTH} height={TILE_LENGTH}>
      <Rect x={0} y={0} width={TILE_LENGTH} height={TILE_LENGTH} fill="#3e753b" />
      {type === 'monster' ? (
        <Image x={30} y={30} width={TILE_LENGTH - 60} height={TILE_LENGTH - 60} image={image} />
      ) : null}
      <Text
        x={0}
        y={0}
        width={TILE_LENGTH}
        height={TILE_LENGTH}
        text={type}
        align="center"
        fill="#fff"
        fontStyle="bold"
        verticalAlign="bottom"
        padding={10}
      />
    </Group>
  );
};
