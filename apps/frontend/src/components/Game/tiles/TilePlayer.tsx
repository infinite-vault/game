import { Circle, Text, Group } from 'react-konva';
import { getCoordinate } from '../../../utils/getCoordinate';
import { HoverTiles } from './HoverTiles';
import { useEffect } from 'react';
import { useAtomValue } from 'jotai';
import { stageAtom } from '../../../store/stageState';
import { getRandomInt } from '../../../utils/getRandomInt';
import { Prisma } from 'database';
import { TILE_LENGTH_HALF } from '../../../pages/Game/logic/TileLogic';

interface TilePlayerProps {
  gameId: string;
  player: Prisma.CharacterGetPayload<{ include: { tile: true; action: true } }>;
  isMe: boolean;
}

const PLAYER_CIRCLE_DIAMETER = 30;

export const TilePlayer = ({ isMe, gameId, player }: TilePlayerProps) => {
  const showHoverTiles = !player.action && isMe;
  const stage = useAtomValue(stageAtom);

  useEffect(() => {
    if (!showHoverTiles && stage) {
      stage.container().style.cursor = 'auto';
    }
  }, [showHoverTiles]);

  return (
    <Group
      x={getCoordinate(player.tile?.x as number) + TILE_LENGTH_HALF}
      y={getCoordinate(player.tile?.y as number) + TILE_LENGTH_HALF}
      width={PLAYER_CIRCLE_DIAMETER}
      height={PLAYER_CIRCLE_DIAMETER}
      opacity={0.75}
    >
      <Group
        x={getRandomInt(-20, 20)}
        y={getRandomInt(-20, 20)}
        width={PLAYER_CIRCLE_DIAMETER}
        height={PLAYER_CIRCLE_DIAMETER}
      >
        <Circle
          x={0}
          y={0}
          width={PLAYER_CIRCLE_DIAMETER}
          height={PLAYER_CIRCLE_DIAMETER}
          fill="#fff"
        />
        <Text
          text={player.name.slice(0, 3)}
          x={PLAYER_CIRCLE_DIAMETER / -2}
          y={PLAYER_CIRCLE_DIAMETER / -2 + 1}
          width={PLAYER_CIRCLE_DIAMETER}
          height={PLAYER_CIRCLE_DIAMETER}
          align="center"
          fontStyle="bold"
          verticalAlign="middle"
        />
      </Group>

      {showHoverTiles ? (
        <HoverTiles x={player.tile?.x as number} y={player.tile?.y as number} gameId={gameId} />
      ) : null}
    </Group>
  );
};
