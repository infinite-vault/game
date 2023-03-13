import { KonvaEventObject } from 'konva/lib/Node';
import { useEffect, useRef, useState } from 'react';
import { Layer, Stage } from 'react-konva';
import Konva from 'konva';
import { Vector2d } from 'konva/lib/types';
import { Box } from '@mui/material';
import { useWindowSize } from '../../../hooks/useWindowSize';
import { Tile } from '../../../types/Tile';
import { isObject } from '../../../utils/isObject';
import { VisibleTile } from './VisibleTile';
import { HiddenTile } from './HiddenTile';
import { useQuery } from '@apollo/client';
import { GET_TILES } from '../../../graphql/queries';
import { Character } from '../../../types/Character';
import { TilePlayers } from './TilePlayers';
import { UPDATE_TILE_SUBSCRIPTION } from '../../../graphql/subscriptions';
import { useSetAtom } from 'jotai';
import { stageAtom } from '../../../store/stageState';

interface TilesProps {
  gameId: string;
  players: Character[];
}

export const TILE_LENGTH = 120;
export const TILE_LENGTH_HALF = TILE_LENGTH / 2;
const MIN_SCALE = 0.4;
const MAX_SCALE = 4;
const SCALE_FACTOR = 1.05;

export const Tiles = ({ gameId, players }: TilesProps) => {
  const { error, data, subscribeToMore } = useQuery(GET_TILES, { variables: { gameId } });
  const windowSize = useWindowSize();
  const [isFirstRender, setFirstRender] = useState(true);
  const setStageAtom = useSetAtom(stageAtom);
  const stageRef = useRef<Konva.Stage>(null);
  const stage = stageRef?.current;
  const tiles = data?.tiles as Tile[];

  useEffect(() => {
    subscribeToMore({
      document: UPDATE_TILE_SUBSCRIPTION,
      variables: { gameId },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return prev;
        }

        const updateTile = subscriptionData.data.updateTile as Tile;
        const isTileNew = prev.tiles?.findIndex((tile: Tile) => tile.id === updateTile.id) === -1;

        if (isTileNew) {
          return { tiles: [...prev.tiles, updateTile] };
        }

        return {
          tiles: prev.tiles.map((tile: Tile) => (tile.id === updateTile.id ? { ...tile, ...updateTile } : tile)),
        };
      },
    });

    return () => {
      setStageAtom(null);
    };
  }, []);

  useEffect(() => {
    if (stageRef?.current) {
      setStageAtom(stageRef?.current);
    }
  }, [stageRef?.current]);

  useEffect(() => {
    if (tiles && isFirstRender && windowSize?.width && windowSize?.height) {
      stageRef?.current?.position({ x: windowSize.width / 2, y: windowSize.height / 2 });
      setFirstRender(false);
    }
  }, [tiles, windowSize]);

  if (error) {
    return <Box>Error loading tiles</Box>;
  }

  if (!tiles) {
    return <Box>Lade Karte...</Box>;
  }

  const handleWheel = (e: KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();

    if (!stage) {
      return;
    }

    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition() as Vector2d;
    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    let direction = e.evt.deltaY > 0 ? 1 : -1;

    // when we zoom on trackpad, e.evt.ctrlKey is true in that case lets revert direction
    if (e.evt.ctrlKey) {
      direction = -direction;
    }

    let newScale = direction > 0 ? oldScale * SCALE_FACTOR : oldScale / SCALE_FACTOR;
    if (newScale > MAX_SCALE) {
      newScale = MAX_SCALE;
    } else if (newScale < MIN_SCALE) {
      newScale = MIN_SCALE;
    }
    stage.scale({ x: newScale, y: newScale });

    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };
    stage.position(newPos);
  };

  const renderTiles = (activeTiles: Tile[]) => {
    const hiddenTiles: { [key: string]: boolean | Vector2d } = {};
    const setHiddenTile = (x: number, y: number) => {
      if (hiddenTiles[`${x}:${y}`] !== false) {
        hiddenTiles[`${x}:${y}`] = { x, y };
      }
    };

    const components =
      activeTiles?.map((tile) => {
        hiddenTiles[`${tile.x}:${tile.y}`] = false;
        setHiddenTile(tile.x, tile.y + 1);
        setHiddenTile(tile.x + 1, tile.y);
        setHiddenTile(tile.x, tile.y - 1);
        setHiddenTile(tile.x - 1, tile.y);
        setHiddenTile(tile.x + 1, tile.y + 1);
        setHiddenTile(tile.x + 1, tile.y - 1);
        setHiddenTile(tile.x - 1, tile.y - 1);
        setHiddenTile(tile.x - 1, tile.y + 1);

        return <VisibleTile key={`tile-visible-${tile.id}`} x={tile.x} y={tile.y} type={tile.type} />;
      }) || [];

    for (const [, value] of Object.entries(hiddenTiles)) {
      if (isObject(value)) {
        const { x, y } = value as Vector2d;
        components.push(<HiddenTile key={`tile-hidden-${x}-${y}`} x={x} y={y} />);
      }
    }

    return <>{components}</>;
  };

  return (
    <Stage ref={stageRef} width={windowSize.width} height={windowSize.height} draggable onWheel={handleWheel}>
      <Layer>
        {renderTiles(tiles)}
        <TilePlayers players={players} gameId={gameId} />
      </Layer>
    </Stage>
  );
};
