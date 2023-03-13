import { KonvaEventObject } from 'konva/lib/Node';

export const setStageCursor = (ev: KonvaEventObject<MouseEvent>, cursor = 'auto') => {
  const stage = ev.currentTarget.getStage();
  if (stage) {
    stage.container().style.cursor = cursor;
  }
};
