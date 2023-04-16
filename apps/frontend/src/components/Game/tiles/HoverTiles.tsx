import { useMutation } from '@apollo/client';
import { Vector2d } from 'konva/lib/types';
import { Rect } from 'react-konva';
import { MOVE_TO } from '../../../graphql/mutations';
import { setStageCursor } from '../../../utils/setStageCursor';
import { TILE_LENGTH, TILE_LENGTH_HALF } from './Tiles';

interface HoverTilesProps {
  x: number;
  y: number;
  gameId: string;
}

const RenderHoverTiles = ({
  x,
  y,
  moveToX,
  moveToY,
  gameId,
}: Vector2d & { moveToX: number; moveToY: number; gameId: string }) => {
  const [moveTo, { loading }] = useMutation(MOVE_TO);

  const handleMoveToClick = () => {
    if (!loading) {
      moveTo({ variables: { x: moveToX, y: moveToY, gameId } });
    }
  };

  return (
    <Rect
      x={x}
      y={y}
      width={TILE_LENGTH}
      height={TILE_LENGTH}
      stroke="lightgrey"
      onMouseEnter={(ev) => {
        setStageCursor(ev, 'pointer');
        ev.target.setAttr('stroke', 'blue').zIndex(8);
      }}
      onMouseLeave={(ev) => {
        setStageCursor(ev);
        ev.target.setAttr('stroke', 'lightgrey').zIndex(0);
      }}
      onClick={handleMoveToClick}
      onTap={handleMoveToClick}
    />
  );
};

export const HoverTiles = ({ x, y, gameId }: HoverTilesProps) => {
  return (
    <>
      <RenderHoverTiles
        x={TILE_LENGTH_HALF}
        y={TILE_LENGTH_HALF}
        moveToX={x + 1}
        moveToY={y + 1}
        gameId={gameId}
      />
      <RenderHoverTiles
        x={TILE_LENGTH_HALF}
        y={-TILE_LENGTH_HALF}
        moveToX={x + 1}
        moveToY={y}
        gameId={gameId}
      />
      <RenderHoverTiles
        x={TILE_LENGTH_HALF}
        y={-TILE_LENGTH - TILE_LENGTH_HALF}
        moveToX={x + 1}
        moveToY={y - 1}
        gameId={gameId}
      />
      <RenderHoverTiles
        x={-TILE_LENGTH_HALF}
        y={TILE_LENGTH_HALF}
        moveToX={x}
        moveToY={y + 1}
        gameId={gameId}
      />
      <RenderHoverTiles
        x={-TILE_LENGTH_HALF}
        y={-TILE_LENGTH - TILE_LENGTH_HALF}
        moveToX={x}
        moveToY={y - 1}
        gameId={gameId}
      />
      <RenderHoverTiles
        x={-TILE_LENGTH - TILE_LENGTH_HALF}
        y={TILE_LENGTH_HALF}
        moveToX={x - 1}
        moveToY={y + 1}
        gameId={gameId}
      />
      <RenderHoverTiles
        x={-TILE_LENGTH - TILE_LENGTH_HALF}
        y={-TILE_LENGTH_HALF}
        moveToX={x - 1}
        moveToY={y}
        gameId={gameId}
      />
      <RenderHoverTiles
        x={-TILE_LENGTH - TILE_LENGTH_HALF}
        y={-TILE_LENGTH - TILE_LENGTH_HALF}
        moveToX={x - 1}
        moveToY={y - 1}
        gameId={gameId}
      />
    </>
  );
};
