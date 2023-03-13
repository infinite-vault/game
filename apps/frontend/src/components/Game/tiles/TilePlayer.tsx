import { Circle, Text, Group } from 'react-konva';
import { Character } from '../../../types/Character';
import { getCoordinate } from '../../../utils/getCoordinate';
import { TILE_LENGTH_HALF } from './Tiles';
import { HoverTiles } from './HoverTiles';
import { useEffect } from 'react';
import { useAtomValue } from 'jotai';
import { stageAtom } from '../../../store/stageState';
import { getRandomInt } from '../../../utils/getRandomInt';

interface TilePlayerProps {
  gameId: string;
  player: Character;
  isMe: boolean;
}

const PLAYER_CIRCLE_DIAMETER = 30;

export const TilePlayer = ({ isMe, gameId, player }: TilePlayerProps) => {
  const showHoverTiles = player.nextAction === 'move' && isMe;
  const stage = useAtomValue(stageAtom);

  useEffect(() => {
    if (!showHoverTiles && stage) {
      stage.container().style.cursor = 'auto';
    }
  }, [showHoverTiles]);

  return (
    <Group
      x={getCoordinate(player.x) + TILE_LENGTH_HALF}
      y={getCoordinate(player.y) + TILE_LENGTH_HALF}
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
        <Circle x={0} y={0} width={PLAYER_CIRCLE_DIAMETER} height={PLAYER_CIRCLE_DIAMETER} fill="#fff" />
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

      {showHoverTiles ? <HoverTiles x={player.x} y={player.y} gameId={gameId} /> : null}
    </Group>
  );
};
