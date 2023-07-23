import axios from 'axios';
import { ApiPath } from 'types';

interface MoveToTileProps {
  x: number;
  y: number;
  gameId: string;
}

export const moveToTile = ({ x, y, gameId }: MoveToTileProps) =>
  axios.post(ApiPath.MOVE_TO_TILE, { x, y, gameId }).then(({ data }) => data);
