import { ReactNode, useEffect, useRef } from 'react';
import { Layer, Stage } from 'react-konva';
import { useWindowSize } from '../../../hooks/useWindowSize';
import Konva from 'konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { Vector2d } from 'konva/lib/types';
import { useSetAtom } from 'jotai';
import { stageAtom } from '../../../store/stageState';

interface StageLogicProps {
  children: ReactNode[];
}

export const TILE_LENGTH = 120;
export const TILE_LENGTH_HALF = TILE_LENGTH / 2;
const MIN_SCALE = 0.4;
const MAX_SCALE = 4;
const SCALE_FACTOR = 1.05;

export const StageLogic = ({ children }: StageLogicProps) => {
  const windowSize = useWindowSize();
  const setStageAtom = useSetAtom(stageAtom);
  const stageRef = useRef<Konva.Stage>(null);
  const stage = stageRef?.current;

  useEffect(() => () => setStageAtom(null)), [];

  useEffect(() => {
    if (stageRef?.current) {
      setStageAtom(stageRef?.current);
      console.log('stage ref changed', stageRef?.current);
    }
  }, [stageRef?.current]);

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

  return (
    <Stage
      ref={stageRef}
      width={windowSize.width}
      height={windowSize.height}
      draggable
      onWheel={handleWheel}
    >
      <Layer>{children}</Layer>
    </Stage>
  );
};
