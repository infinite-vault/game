import { Group, Image, Text } from 'react-konva';
import useImage from 'use-image';
import { getCoordinate } from '../../../utils/getCoordinate';
import { TILE_LENGTH } from '../../../pages/Game/logic/TileLogic';

interface VisibleTileProps {
  x: number;
  y: number;
  type: string;
}

export const Background = () => {
  const [image] = useImage('/images/gras.png');

  return <Image image={image} width={TILE_LENGTH} height={TILE_LENGTH} />;
};

export const VisibleTile = ({ x, y, type }: VisibleTileProps) => {
  const [image] = useImage('/images/monster.png');

  return (
    <Group x={getCoordinate(x)} y={getCoordinate(y)} width={TILE_LENGTH} height={TILE_LENGTH}>
      <Background />
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
